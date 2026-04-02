use serde::Serialize;

use super::http::{fetch_with_body, serialize_body, HttpMethod};
use super::registry::ActionMetadata;
use super::types::{EventInput, PluginResult};
use super::utils::value_to_string;

const TWITTER_BASE: &str = "https://api.twitter.com/2";
const TWITTER_ACTION_PREFIX: &str = "twitter:";
const TWITTER_ID_PREFIX: &str = "twitter:";

/// Twitter/X plugin action IDs. Parse from strings at the boundary; use enum for type-safe dispatch.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TwitterAction {
    Like,
    Unlike,
    Retweet,
    Unretweet,
    Bookmark,
    RemoveBookmark,
    MuteAuthor,
    BlockAuthor,
}

impl TwitterAction {
    pub fn action_id(self) -> &'static str {
        match self {
            Self::Like => "twitter:like",
            Self::Unlike => "twitter:unlike",
            Self::Retweet => "twitter:retweet",
            Self::Unretweet => "twitter:unretweet",
            Self::Bookmark => "twitter:bookmark",
            Self::RemoveBookmark => "twitter:remove_bookmark",
            Self::MuteAuthor => "twitter:mute_author",
            Self::BlockAuthor => "twitter:block_author",
        }
    }

    fn metadata(self) -> ActionMetadata {
        let (name, description, scopes) = match self {
            Self::Like => ("Like Tweet", "Like a tweet", vec!["like.write".into()]),
            Self::Unlike => ("Unlike Tweet", "Remove like from a tweet", vec!["like.write".into()]),
            Self::Retweet => ("Retweet", "Retweet a tweet", vec!["tweet.write".into()]),
            Self::Unretweet => ("Undo Retweet", "Undo a retweet", vec!["tweet.write".into()]),
            Self::Bookmark => (
                "Bookmark Tweet",
                "Bookmark a tweet for later",
                vec!["bookmark.write".into()],
            ),
            Self::RemoveBookmark => (
                "Remove Bookmark",
                "Remove a tweet bookmark",
                vec!["bookmark.write".into()],
            ),
            Self::MuteAuthor => (
                "Mute Author",
                "Mute the author of a tweet",
                vec!["users.read".into()],
            ),
            Self::BlockAuthor => (
                "Block Author",
                "Block the author of a tweet",
                vec!["users.read".into()],
            ),
        };
        ActionMetadata {
            id: self.action_id().into(),
            name: name.into(),
            description: description.into(),
            required_scopes: scopes,
        }
    }

    fn all() -> &'static [Self] {
        &[
            Self::Like,
            Self::Unlike,
            Self::Retweet,
            Self::Unretweet,
            Self::Bookmark,
            Self::RemoveBookmark,
            Self::MuteAuthor,
            Self::BlockAuthor,
        ]
    }
}

impl std::str::FromStr for TwitterAction {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let normalized = s.trim().to_ascii_lowercase();
        let normalized = normalized
            .strip_prefix(TWITTER_ACTION_PREFIX)
            .unwrap_or(&normalized);
        match normalized {
            "like" => Ok(Self::Like),
            "unlike" => Ok(Self::Unlike),
            "retweet" => Ok(Self::Retweet),
            "unretweet" => Ok(Self::Unretweet),
            "bookmark" => Ok(Self::Bookmark),
            "remove_bookmark" => Ok(Self::RemoveBookmark),
            "mute_author" => Ok(Self::MuteAuthor),
            "block_author" => Ok(Self::BlockAuthor),
            _ => Err(format!("unknown twitter action: {s}")),
        }
    }
}

pub(crate) fn actions_metadata() -> Vec<ActionMetadata> {
    TwitterAction::all().iter().map(|a| a.metadata()).collect()
}

pub(crate) fn required_scopes(action_id: &str) -> Vec<String> {
    action_id
        .parse::<TwitterAction>()
        .ok()
        .map(|a| a.metadata().required_scopes)
        .unwrap_or_default()
}

#[derive(Clone, Debug, Serialize)]
struct TwitterTweetActionRequest {
    #[serde(rename = "tweet_id")]
    tweet_id: String,
}

#[derive(Clone, Debug, Serialize)]
struct TwitterUserTargetRequest {
    #[serde(rename = "target_user_id")]
    target_user_id: String,
}

fn extract_tweet_id(event: &EventInput) -> Option<String> {
    let data = &event.data;
    let id = data.get("sourceId").or_else(|| data.get("id"))?;
    let mut id = value_to_string(id)?;
    if let Some(stripped) = id.strip_prefix(TWITTER_ID_PREFIX) {
        id = stripped.to_string();
    }
    Some(id)
}

fn extract_twitter_user_id(config: Option<&serde_json::Value>) -> Option<String> {
    let cfg = config?;
    cfg.get("userId")
        .or_else(|| cfg.get("twitterUserId"))
        .and_then(value_to_string)
}

fn extract_twitter_author_id(event: &EventInput) -> Option<String> {
    let raw = event.data.get("raw")?;
    match raw {
        serde_json::Value::String(s) => {
            let parsed: serde_json::Value = serde_json::from_str(s).ok()?;
            parsed.get("author_id").and_then(value_to_string)
        }
        serde_json::Value::Object(map) => map.get("author_id").and_then(value_to_string),
        _ => None,
    }
}

async fn twitter_api(
    token: &str,
    method: HttpMethod,
    path: &str,
    body: Option<serde_json::Value>,
) -> Result<(), String> {
    let url = format!("{TWITTER_BASE}{path}");
    let resp = fetch_with_body(method, &url, token, body)
        .await
        .map_err(|e| e.to_string())?;
    if resp.status().is_success() {
        return Ok(());
    }
    let status = resp.status();
    if let Ok(json) = resp.json::<serde_json::Value>().await {
        if let Some(detail) = json.get("detail").and_then(|v| v.as_str()) {
            return Err(detail.to_string());
        }
        if let Some(title) = json.get("title").and_then(|v| v.as_str()) {
            return Err(title.to_string());
        }
    }
    Err(format!("Twitter API error: {status}"))
}

async fn tweet_user_action(
    token: &str,
    event: &EventInput,
    config: Option<&serde_json::Value>,
    method: HttpMethod,
    path_fn: impl FnOnce(&str, &str) -> String,
    success_msg_fn: impl FnOnce(&str) -> String,
) -> PluginResult {
    let tweet_id = match extract_tweet_id(event) {
        Some(id) => id,
        None => return PluginResult::err("Missing tweet ID or user ID"),
    };
    let user_id = match extract_twitter_user_id(config) {
        Some(id) => id,
        None => return PluginResult::err("Missing tweet ID or user ID"),
    };
    let path = path_fn(&user_id, &tweet_id);
    let body = match method {
        HttpMethod::Post => match serialize_body(TwitterTweetActionRequest { tweet_id: tweet_id.clone() }) {
            Ok(v) => Some(v),
            Err(e) => return PluginResult::err(e),
        },
        HttpMethod::Delete => None,
    };
    if let Err(msg) = twitter_api(token, method, &path, body).await {
        return PluginResult::err(msg);
    }
    PluginResult::ok(success_msg_fn(&tweet_id), None)
}

pub(crate) async fn execute_twitter_action(
    command_id: &str,
    event: &EventInput,
    access_token: &str,
    config: Option<&serde_json::Value>,
) -> PluginResult {
    let action: TwitterAction = match command_id.parse() {
        Ok(a) => a,
        Err(_) => return PluginResult::err(format!("Command \"{command_id}\" not supported")),
    };
    match action {
        TwitterAction::Like => {
            tweet_user_action(
                access_token,
                event,
                config,
                HttpMethod::Post,
                |uid, _tid| format!("/users/{uid}/likes"),
                |tid| format!("Liked tweet {tid}"),
            )
            .await
        }
        TwitterAction::Unlike => {
            tweet_user_action(
                access_token,
                event,
                config,
                HttpMethod::Delete,
                |uid, tid| format!("/users/{uid}/likes/{tid}"),
                |tid| format!("Unliked tweet {tid}"),
            )
            .await
        }
        TwitterAction::Retweet => {
            tweet_user_action(
                access_token,
                event,
                config,
                HttpMethod::Post,
                |uid, _tid| format!("/users/{uid}/retweets"),
                |tid| format!("Retweeted tweet {tid}"),
            )
            .await
        }
        TwitterAction::Unretweet => {
            tweet_user_action(
                access_token,
                event,
                config,
                HttpMethod::Delete,
                |uid, tid| format!("/users/{uid}/retweets/{tid}"),
                |tid| format!("Undid retweet of {tid}"),
            )
            .await
        }
        TwitterAction::Bookmark => {
            tweet_user_action(
                access_token,
                event,
                config,
                HttpMethod::Post,
                |uid, _tid| format!("/users/{uid}/bookmarks"),
                |tid| format!("Bookmarked tweet {tid}"),
            )
            .await
        }
        TwitterAction::RemoveBookmark => {
            tweet_user_action(
                access_token,
                event,
                config,
                HttpMethod::Delete,
                |uid, tid| format!("/users/{uid}/bookmarks/{tid}"),
                |tid| format!("Removed bookmark from {tid}"),
            )
            .await
        }
        TwitterAction::MuteAuthor | TwitterAction::BlockAuthor => {
            let author_id = match extract_twitter_author_id(event) {
                Some(id) => id,
                None => return PluginResult::err("Missing author ID or user ID"),
            };
            let user_id = match extract_twitter_user_id(config) {
                Some(id) => id,
                None => return PluginResult::err("Missing author ID or user ID"),
            };
            let (path_suffix, verb) = match action {
                TwitterAction::MuteAuthor => ("muting", "Muted"),
                TwitterAction::BlockAuthor => ("blocking", "Blocked"),
                _ => unreachable!(),
            };
            let body = match serialize_body(TwitterUserTargetRequest { target_user_id: author_id.clone() }) {
                Ok(v) => v,
                Err(e) => return PluginResult::err(e),
            };
            if let Err(msg) = twitter_api(
                access_token,
                HttpMethod::Post,
                &format!("/users/{user_id}/{path_suffix}"),
                Some(body),
            )
            .await
            {
                return PluginResult::err(msg);
            }
            PluginResult::ok(format!("{verb} user {author_id}"), None)
        }
    }
}

pub struct TwitterPlugin;

#[async_trait::async_trait(?Send)]
impl super::traits::Plugin for TwitterPlugin {
    fn id(&self) -> super::PluginId {
        super::PluginId::Twitter
    }

    fn metadata(&self) -> Vec<ActionMetadata> {
        actions_metadata()
    }

    fn required_scopes(&self, action_id: &str) -> Vec<String> {
        required_scopes(action_id)
    }

    async fn execute(
        &self,
        command_id: &str,
        event: &EventInput,
        access_token: &str,
        config: Option<&serde_json::Value>,
    ) -> PluginResult {
        execute_twitter_action(command_id, event, access_token, config).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn twitter_action_from_str_normalizes_and_strips_prefix() {
        assert_eq!("twitter:like".parse::<TwitterAction>(), Ok(TwitterAction::Like));
        assert_eq!("  Like  ".parse::<TwitterAction>(), Ok(TwitterAction::Like));
        assert!("unknown".parse::<TwitterAction>().is_err());
    }
}
