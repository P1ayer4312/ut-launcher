param(
  [string]$messageBridgeFile,
  [string]$path_vc,
  [string]$path_dx
)

function Send-Message($text) {
  $text | Out-File -FilePath $messageBridgeFile -Encoding utf8
}

Send-Message("Installing vcredist_x64.exe (1/2) ...")
Start-Process -FilePath $path_vc -ArgumentList "/install", "/quiet", "/norestart" -Wait
Start-Sleep -Seconds 3

Send-Message("Installing dxwebsetup.exe (2/2) ...")
Start-Process -FilePath $path_dx -ArgumentList "/q" -Wait
Start-Sleep -Seconds 3

Send-Message("Done")
