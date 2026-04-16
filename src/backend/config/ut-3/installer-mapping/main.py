import os
import json

def main():
    files_hashes = dict()
    directories_hashes = dict()
    component_mapping = dict()

    # Map file names
    with open('./file.tsv', 'r') as file:
        for line in file:
            line_split = line.strip().split('\t')

            if len(line_split) < 3 or '.' not in line_split[2]:
                continue

            file_id = line_split[0]
            file_component_id = line_split[1]
            file_name = line_split[2]

            if files_hashes.get(file_component_id) == None:
                files_hashes[file_component_id] = dict()

            if '|' in line_split[2]:
                file_name = line_split[2].split('|')[1]

            files_hashes[file_component_id][file_id] = file_name

    # Map directories to combined routes
    with open('./directory.tsv', 'r') as directory:
        for line in directory:
            line_split = line.strip().split('\t')

            if len(line_split[0]) != 33:
                continue

            dir_name = line_split[2]
            if '|' in line_split[2]:
                dir_name = line_split[2].split('|')[1]

            dir_id = line_split[0]
            dir_parent = ".\\"
            dir_parent_id = line_split[1]

            dir_present = directories_hashes.get(dir_parent_id)
            if dir_present != None:
                dir_parent = dir_present

            directories_hashes[dir_id] = os.path.join(dir_parent, dir_name)

    # Join component ids with files and directories
    with open('./component.tsv', 'r') as component:
        for line in component:
            line_split = line.strip().split('\t')

            if len(line_split[0]) != 33:
                continue

            file_component_id = line_split[0]
            directory_id = line_split[2]

            if files_hashes.get(file_component_id) == None:
                continue

            directory_path = directories_hashes[directory_id]
            for key, value in files_hashes[file_component_id].items():
                component_mapping[key] = os.path.join(directory_path, value)

    # Export the mapped files and directories to json
    with open('files_mapped.json', 'w+') as f:
        f.write(json.dumps(component_mapping))

    with open('directories_list.json', 'w+') as f:
        f.write(json.dumps(list(directories_hashes.values())))


if __name__ == "__main__":
    main()
