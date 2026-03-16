//! Filesystem plugin — metadata only. Execution runs in web layer (File System Access API).

use super::registry::ActionMetadata;

/// Filesystem plugin action IDs. Execution is handled by the web layer.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FilesystemAction {
    ReadFile,
    WriteFile,
    ListDir,
    CreateFile,
    DeleteFile,
}

impl FilesystemAction {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::ReadFile => "read_file",
            Self::WriteFile => "write_file",
            Self::ListDir => "list_dir",
            Self::CreateFile => "create_file",
            Self::DeleteFile => "delete_file",
        }
    }


    fn metadata(self) -> ActionMetadata {
        let (name, description) = match self {
            Self::ReadFile => ("Read File", "Read contents of a file in the chosen directory"),
            Self::WriteFile => ("Write File", "Write content to a file in the chosen directory"),
            Self::ListDir => ("List Directory", "List files and subdirectories in the chosen directory"),
            Self::CreateFile => ("Create File", "Create a new file in the chosen directory"),
            Self::DeleteFile => ("Delete File", "Delete a file in the chosen directory"),
        };
        ActionMetadata {
            id: self.as_str().into(),
            name: name.into(),
            description: description.into(),
            required_scopes: vec![],
        }
    }

    fn all() -> &'static [Self] {
        &[
            Self::ReadFile,
            Self::WriteFile,
            Self::ListDir,
            Self::CreateFile,
            Self::DeleteFile,
        ]
    }
}

pub(crate) fn actions_metadata() -> Vec<ActionMetadata> {
    FilesystemAction::all().iter().map(|a| a.metadata()).collect()
}

pub(crate) fn required_scopes(_action_id: &str) -> Vec<String> {
    vec![]
}
