#define AppName "GadTube"
#define AppExeName "GadTube.exe"

[Setup]
AppName={#AppName}
AppVersion=1.0
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputBaseFilename=GadTubeSetup
OutputDir=..\dist_installer
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64compatible

[Files]
Source: "..\dist\GadTube.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "vendor\ffmpeg.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "vendor\yt-dlp.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "vendor\nssm.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\static\gadtube.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\config.ini"; DestDir: "{commonappdata}\{#AppName}"; Flags: onlyifdoesntexist

[Run]
Filename: "{app}\nssm.exe"; Parameters: "install {#AppName} ""{app}\{#AppExeName}"""; Flags: runhidden
Filename: "{app}\nssm.exe"; Parameters: "set {#AppName} Start SERVICE_AUTO_START"; Flags: runhidden
Filename: "{app}\nssm.exe"; Parameters: "start {#AppName}"; Flags: runhidden

[UninstallRun]
Filename: "{app}\nssm.exe"; Parameters: "stop {#AppName}"; Flags: runhidden; RunOnceId: "StopService"
Filename: "{app}\nssm.exe"; Parameters: "remove {#AppName} confirm"; Flags: runhidden; RunOnceId: "RemoveService"

[UninstallDelete]
Type: filesandordirs; Name: "{commonappdata}\{#AppName}"
Type: files; Name: "{userdesktop}\{#AppName}.url"

[Code]
procedure CreateDesktopShortcut();
var
  ShortcutPath: string;
  IniPath: string;
  Port: string;
begin
  IniPath := ExpandConstant('{commonappdata}\{#AppName}\config.ini');
  Port := GetIniString('server', 'port', '5000', IniPath);
  ShortcutPath := ExpandConstant('{userdesktop}\{#AppName}.url');
  SaveStringToFile(ShortcutPath,
    '[InternetShortcut]' + #13#10 +
    'URL=http://localhost:' + Port + #13#10 +
    'IconFile=' + ExpandConstant('{app}\gadtube.ico') + #13#10 +
    'IconIndex=0' + #13#10,
    False);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
    CreateDesktopShortcut();
end;
