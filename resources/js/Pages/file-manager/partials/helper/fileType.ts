const extensionsList: Record<string, string> = {
  // Text Files
  doc: "Word document",
  docx: "Word document",
  eml: "E-Mail message",
  log: "Log file",
  txt: "Text file",
  md: "Markdown file",
  rtf: "Rich Text Format",
  odt: "OpenDocument Text",

  // Audio Files
  aif: "Audio Interchange File",
  m3u: "M3U Media Playlist",
  m4a: "MPEG-4 Audio",
  mid: "MIDI File",
  mp3: "MP3 Audio",
  wma: "Windows Media Audio",

  // Video Files
  avi: "AVI File",
  flv: "Flash Video",
  m4v: "iTunes Video File",
  mov: "Apple QuickTime Movie",
  mp4: "MPEG-4 Video",
  mpg: "MPEG Video",
  wmv: "Windows Media Video",
  webm: "Web Media Video",
  mkv: "Matroska Video",

  // Image Files
  png: "Image",
  jpg: "Image",
  jpeg: "Image",
  psd: "Adobe Photoshop",
  dcm: "DICOM Image",
  bmp: "Bitmap Image",
  ai: "Adobe Illustrator",
  svg: "Scalable Vector Graphics",
  webp: "Web Image",

  // Archive Files
  zip: "Archive",
  "7z": "Archive",
  rar: "Archive",
  tar: "Archive",
  gz: "Gzip Archive",
  bz2: "Bzip2 Archive",

  // Programming Language Files
  js: "JavaScript File",
  ts: "TypeScript File",
  jsx: "React JavaScript File",
  tsx: "React TypeScript File",
  java: "Java Source File",
  cpp: "C++ Source File",
  c: "C Source File",
  cs: "C# Source File",
  php: "PHP Script",
  py: "Python Script",
  rb: "Ruby Script",
  go: "Go Source File",
  rs: "Rust Source File",
  swift: "Swift Source File",
  kt: "Kotlin Source File",

  // Binary & Data Files
  bin: "Binary File",
  dat: "Data File",
  hex: "Hexadecimal File",
  iso: "Disk Image",
  img: "Disk Image File",
  dll: "Dynamic Link Library",
  so: "Shared Object File",

  // Shell & Configuration Files
  sh: "Shell Script",
  bat: "Batch File",
  cmd: "Command Script",
  ps1: "PowerShell Script",
  env: "Environment Configuration File",
  ini: "INI Configuration File",
  cfg: "Configuration File",
  conf: "Configuration File",
  yml: "YAML Configuration File",
  yaml: "YAML Configuration File",

  // JSON & Structured Data
  json: "JSON File",
  xml: "XML File",
  csv: "Comma-Separated Values File",

  // Executable Files
  exe: "Windows Executable File",
  msi: "Windows Installer File",
  dmg: "Mac Disk Image",
  app: "Mac Application File",
  deb: "Debian Package",
  rpm: "Red Hat Package Manager File",
};

export function getFileType(extension: string) {
  return extensionsList[extension.toLowerCase()] ?? "File";
}
