cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
gap = undefined
indent = undefined
meta =
  # table of character substitutions
  "\b": "\\b"
  "\t": "\\t"
  "\n": "\\n"
  "\f": "\\f"
  "\r": "\\r"
  "\"": "\\\""
  "\\": "\\\\"

rep = undefined

quote = (string) ->
  
  # If the string contains no control characters, no quote characters, and no
  # backslash characters, then we can safely slap some quotes around it.
  # Otherwise we must also replace the offending characters with safe escape
  # sequences.
  escapable.lastIndex = 0
  (if escapable.test(string) then "\"" + string.replace(escapable, (a) ->
    c = meta[a]
    (if typeof c is "string" then c else "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4))
  ) + "\"" else "\"" + string + "\"")

module.exports = quote