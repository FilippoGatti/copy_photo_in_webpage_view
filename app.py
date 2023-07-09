import os
import json
from tkinter import filedialog, messagebox
import webbrowser

# VARIABLES
js_file = "info.js"
file_setting = "main_folder.txt"
user = os.getlogin()
reset_file = "C:\\Users\\" + user + "\\Downloads\\" + "resetFolderListFinder.pime"
json_structure = {
    "mainPath": "",
    "hasSubFolder": False,
    "listFileMain": [],
    "listSubFolderFiles": [
        # list of dict with as key the path and as value a list of files
    ]
}


# FUNCTIONS
def get_main_folder(file):
    with open(file, "r") as f:
        path = f.readline()
    return path


def rewrite_main_folder_file(file, folder_path):
    with open(file, "w") as f:
        f.write(folder_path)


def look_inside_dir(path):
    global json_structure
    files = []

    json_structure["hasSubFolder"] = True  # update json file

    for d in [x[0] for x in os.walk(path)]:  # get all the subdirectories
        if d != folder:  # don't scan the main directory
            with os.scandir(d) as s:  # scan all the subdirectories
                for e in s:  # iterate through the scansion
                    if e.is_file():  # check only for files
                        files.append(e.name)

        json_structure["listSubFolderFiles"].append({d: files})  # update json file
        files = []  # empty file's list


# COMMANDS
# chose main folder
if os.path.exists(reset_file):
    # let user chose folder
    messagebox.showinfo("Info", "Escolher a nova pasta onde procurar as imagens")
    folder = filedialog.askdirectory()
    # store new path in file.js
    rewrite_main_folder_file(file_setting, folder)
    # delete file in downloads
    os.remove(reset_file)
else:
    # get main folder from file (folder path can be changed in settings)
    folder = get_main_folder(file_setting)

file_list = []  # create an empty list

# scan in the main folder
with os.scandir(folder) as scan:
    # update json structure
    json_structure["mainPath"] = folder

    for el in scan:
        if el.is_file():  # working for files
            file_list.append(el.name)
        elif el.is_dir():  # working if there is a folder
            look_inside_dir(el.path)

    json_structure["listFileMain"] = file_list  # update json file

# save json file
with open(js_file, "w") as jf:
    js_str = json.dumps(json_structure)  # transform dict into string
    jf.write("let info = " + js_str)

# open web application
webbrowser.open_new_tab("finder.html")
