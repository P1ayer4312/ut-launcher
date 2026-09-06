param(
  [string]$messageBridgeFile,
  [string]$cdKey
)

function Send-Message($text) {
  $text | Out-File -FilePath $messageBridgeFile -Encoding utf8
}

$basePath = "HKLM:\SOFTWARE\Wow6432Node\Unreal Technology\Installed Apps\UT2003"

# Check if the final path already exists
if (-not (Test-Path -Path $basePath)) {
    New-Item -Path $basePath -Force | Out-Null
}

# Set values
New-ItemProperty -Path $basePath -Name "Folder" -Value "PATH" -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "Version" -Value "2225" -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "CDKey" -Value $cdKey -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "ADMIN_RIGHTS" -Value "You need to run this program as an administrator, not as a guest or limited user account." -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "NO_DISC" -Value "No disc in drive. Please insert the disc labelled 'Unreal Tournament 2003 Play Disc' to continue." -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "NO_DRIVE" -Value "No CD-ROM or DVD-ROM drive detected." -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "TITLEBAR" -Value "Unreal Tournament 2003" -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "WRONG_DISC" -Value "Wrong disc in drive. Please insert the disc labelled 'Unreal Tournament 2003 Play Disc' to continue." -PropertyType String -Force
New-ItemProperty -Path $basePath -Name "YEAR" -Value "2003" -PropertyType String -Force

Send-Message('CD-Key registered')
Start-Sleep -Seconds 1
