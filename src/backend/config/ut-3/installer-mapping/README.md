This provides folder and file mapping for manually extracting and installing Unreal Tournament 3, in a way skipping the MSI installer.

Inside the `index.ts` file there are two variables: one that contains the folder structure of the game, and the other one is mapped file name and path where each file needs to be located.

The game files are stored inside `.cab` containers and are named with file ids. In order to restore the file names we'll use the `filesMapping` dictionary to rename and place the files in their correct location, but before we do that we'll generate the folders structure using the `directoriesList` array.

In order to dump the MSI tables we used the msitools utility: `apt install msitools`

```sh
msiinfo export "Unreal Tournament 3.msi" File > file.tsv
msiinfo export "Unreal Tournament 3.msi" Component > component.tsv
msiinfo export "Unreal Tournament 3.msi" Directory > directory.tsv
```

and to parse the data the `main.py` script was used.
