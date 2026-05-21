param(
  [string]$messageBridgeFile,
  [string]$cdKey,
  [string]$filePath,
  [string]$oldEncryptedString
)

function Send-Message($text) {
  $text | Out-File -FilePath $messageBridgeFile -Encoding utf8
}

Add-Type -AssemblyName System.Security

Send-Message "Creating encrypted key..."

# 1. Target the Bluetooth/First adapter to match the game's selection
$adapter = Get-CimInstance Win32_NetworkAdapterConfiguration |
           Where-Object { $_.MACAddress -ne $null } |
           Select-Object -First 1

$macBytes = $adapter.MACAddress.Split(':') | ForEach-Object { [System.Convert]::ToByte($_, 16) }

# 2. Setup 8-byte entropy (6 bytes MAC + 2 bytes padding)
$entropySource = New-Object byte[] 8
[Array]::Copy($macBytes, $entropySource, 6)

# 3. Apply JoeGraf XOR logic
$part1 = [BitConverter]::ToUInt32($entropySource, 0) -bxor 0x4a6f65
$part2 = [BitConverter]::ToUInt32($entropySource, 4) -bxor 0x47726166
$finalEntropy = [BitConverter]::GetBytes($part1) + [BitConverter]::GetBytes($part2)

# 4. Use ASCII for the Product Key (this keeps the string short)
$keyBytes = [System.Text.Encoding]::ASCII.GetBytes($cdKey)

# 5. Encrypt using DPAPI
$encrypted = [System.Security.Cryptography.ProtectedData]::Protect(
    $keyBytes,
    $finalEntropy,
    [System.Security.Cryptography.DataProtectionScope]::LocalMachine
)

# 6. Generate the Registry String
$result = ($encrypted | ForEach-Object { $_.ToString("000") }) -join ""

# 7. Open UTEngine.ini and replace the encrypted key string
Send-Message "Replacing encrypted key..."

$content = Get-Content $filePath
$content = $content -replace $oldEncryptedString, "EncryptedProductKey=$($result)"
$content | Set-Content $filePath

Send-Message "Done"
