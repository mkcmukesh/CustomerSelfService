// Lightweight HTML → TSX converter for Tailwind/DaisyUI + common SVG cases.
// NOTE: Regex approach covers 90% use-cases. Edge cases (complex inline styles)
// may still need manual touchups (see notes in the page UI).

export type HtmlToTsxOptions = {
  selfCloseVoid?: boolean;   // self-close void tags <img>, <br>...
  addAltIfMissing?: boolean; // ensure <img> has alt=""
  keepDataAttrs?: boolean;   // keep data-* attributes (usually yes)
};

const DEFAULTS: HtmlToTsxOptions = {
  selfCloseVoid: true,
  addAltIfMissing: true,
  keepDataAttrs: true,
};

export function htmlToTsx(html: string, opts: HtmlToTsxOptions = {}): string {
  const o = { ...DEFAULTS, ...opts };
  let s = html;

  // Normalize newlines
  s = s.replace(/\r\n/g, "\n");

  // class -> className
  s = s.replace(/\sclass=/g, " className=");

  // General attribute mappings
  s = s.replace(/\sfor=/g, " htmlFor=");
  s = s.replace(/\stabindex=/gi, " tabIndex=");
  s = s.replace(/\sreadonly(\s|>)/gi, " readOnly$1");
  s = s.replace(/\smaxlength=/gi, " maxLength=");
  s = s.replace(/\snovalidate(\s|>)/gi, " noValidate$1");
  s = s.replace(/\sautoplay(\s|>)/gi, " autoPlay$1");
  s = s.replace(/\splaysinline(\s|>)/gi, " playsInline$1");
  s = s.replace(/\ssrcset=/gi, " srcSet=");
  s = s.replace(/\scrossorigin=/gi, " crossOrigin=");
  s = s.replace(/\scontenteditable=/gi, " contentEditable=");

  // SVG attribute mappings (camelCase)
  s = s.replace(/\sstroke-width=/gi, " strokeWidth=");
  s = s.replace(/\sstroke-linecap=/gi, " strokeLinecap=");
  s = s.replace(/\sstroke-linejoin=/gi, " strokeLinejoin=");
  s = s.replace(/\sfill-rule=/gi, " fillRule=");
  s = s.replace(/\sclip-rule=/gi, " clipRule=");
  s = s.replace(/\sviewbox=/gi, " viewBox=");
  s = s.replace(/\sstop-color=/gi, " stopColor=");
  s = s.replace(/\sstop-opacity=/gi, " stopOpacity=");
  s = s.replace(/\sstroke-opacity=/gi, " strokeOpacity=");
  s = s.replace(/\sfill-opacity=/gi, " fillOpacity=");

  // Optional: remove events/on* to avoid accidental handlers from copied HTML
  // s = s.replace(/\son[a-z]+=\s*"[^"]*"/gi, "");

  // Self-close common void elements if not explicitly closed
  if (o.selfCloseVoid) {
    const voidTags = ["img","input","br","hr","meta","link","source","track","area","base","col","embed","param","wbr"];
    for (const tag of voidTags) {
      const re = new RegExp(`<(${tag})([^>]*)>(?!\\s*</\\1>)`, "gi");
      s = s.replace(re, (_m, t, attrs) => `<${t}${attrs} />`);
    }
  }

  // Ensure <img> has alt
  if (o.addAltIfMissing) {
    s = s.replace(/<img((?:(?!alt=)[^>])*)\/?>/gi, (m, attrs) => {
      return /alt=/.test(attrs) ? m : `<img${attrs} alt="" />`;
    });
  }

  // Keep / drop data-* attributes (default: keep)
  if (!o.keepDataAttrs) {
    s = s.replace(/\sdata-[a-z0-9\-]+="[^"]*"/gi, "");
  }

  // Replace style="a: b; c: d" → style={{ a: "b", c: "d" }}
  // Basic conversion; does not handle complex values/functions.
  s = s.replace(/\sstyle="([^"]*)"/gi, (_m, css) => {
    const rules = css
      .split(";")
      .map(r => r.trim())
      .filter(Boolean)
      .map(rule => {
        const [prop, val] = rule.split(":").map(x => x.trim());
        if (!prop || !val) return null;
        // kebab-case -> camelCase
        const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        // Quote the value unless it's pure number (without units)
        const needsQuotes = isNaN(Number(val)) || /[a-z%]/i.test(val);
        return `${camel}: ${needsQuotes ? `"${val}"` : val}`;
      })
      .filter(Boolean)
      .join(", ");
    return ` style={{ ${rules} }}`;
  });

  // Convert boolean attributes (optional — React accepts presence as true)
  // Example: disabled => disabled
  // If you need explicit {true}, uncomment below.
  // s = s.replace(/\s(disabled|checked|selected|multiple|controls|autofocus)(\s|>)/gi, " $1$2");

  // Ensure proper closing of <textarea> (React disallows self-closed textarea)
  s = s.replace(/<textarea([^>]*)\/>/gi, "<textarea$1></textarea>");

  return s;
}
