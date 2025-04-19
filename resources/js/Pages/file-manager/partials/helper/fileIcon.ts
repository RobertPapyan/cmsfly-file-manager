import {
  FileIcon, FileCodeIcon, FileDigitIcon, FileTextIcon, FolderArchiveIcon, ImageIcon,
  FileVideoIcon, FileTerminalIcon, FileCogIcon, FileJsonIcon, AppWindowIcon,
  LucideIcon, MusicIcon
} from "lucide-vue-next";


const IconMap = [
  { icon: FileCodeIcon, extensions: ['js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 'php', 'py', 'rb', 'go', 'rs', 'swift', 'kt'] },
  { icon: FileDigitIcon, extensions: ['bin', 'dat', 'hex', 'iso', 'img', 'raw', 'dll', 'so'] },
  { icon: FileTextIcon, extensions: ['txt', 'md', 'doc', 'docx', 'rtf', 'odt', 'log'] },
  { icon: FolderArchiveIcon, extensions: ['zip', 'rar', 'tar', 'gz', '7z', 'bz2'] },
  { icon: ImageIcon, extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp'] },
  { icon: FileVideoIcon, extensions: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'] },
  { icon: FileTerminalIcon, extensions: ['sh', 'bat', 'cmd', 'ps1'] },
  { icon: FileCogIcon, extensions: ['env', 'ini', 'cfg', 'conf', 'yml', 'yaml'] },
  { icon: FileJsonIcon, extensions: ['json'] },
  { icon: AppWindowIcon, extensions: ['exe', 'msi', 'dmg', 'app', 'deb', 'rpm'] },
  { icon: MusicIcon, extensions: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma', 'opus'] },
];

export function getFileIcon(extension: string): LucideIcon {
  extension = extension.toLowerCase();

  const match = IconMap.find(entry => entry.extensions.includes(extension));

  return match ? match.icon : FileIcon;
}
