pub(crate) fn value_to_string(v: &serde_json::Value) -> Option<String> {
    match v {
        serde_json::Value::String(s) => Some(s.clone()),
        serde_json::Value::Number(n) => Some(n.to_string()),
        serde_json::Value::Bool(b) => Some(b.to_string()),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn string_value() {
        assert_eq!(value_to_string(&json!("hello")), Some("hello".to_string()));
    }

    #[test]
    fn number_value() {
        assert_eq!(value_to_string(&json!(42)), Some("42".to_string()));
    }

    #[test]
    fn bool_true_value() {
        assert_eq!(value_to_string(&json!(true)), Some("true".to_string()));
    }

    #[test]
    fn null_value() {
        assert_eq!(value_to_string(&json!(null)), None);
    }

    #[test]
    fn array_value() {
        assert_eq!(value_to_string(&json!([1, 2, 3])), None);
    }

    #[test]
    fn object_value() {
        assert_eq!(value_to_string(&json!({"key": "val"})), None);
    }
}
