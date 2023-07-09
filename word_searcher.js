// VARIABLES
const mainFolder = document.getElementById("mainFolder");
const subFolders = document.getElementById("subFolders");
const textFormEmptyFilter = "Nenhuma imagem encontrada nesta pasta!";
const imageButton = document.getElementById("showImg");
// info object is in another js file

// compile tha page to start
window.onload = (event) => {
    populateMainFolder();
    if(info["hasSubFolder"]) {
        populateSubFolder();
    };
};

// EVENT LISTENER (change list for every tiping)
document.getElementById("search").addEventListener("input", function(e) {
    imageButton.disabled = false;

    let word = document.getElementById("search").value

    let result = info["listFileMain"].filter((el) => el.toLowerCase().includes(word));

    populateResults(mainFolderResults, result);

    if(info["hasSubFolder"]) {
        for(i = 0; i < info["listSubFolderFiles"].length; i++) {
            let subdiv = document.querySelector(`.sub${i}`);
            let key = subdiv.getAttribute("path");
            
            let files = info["listSubFolderFiles"][i][key];
            
            let subresult = files.filter((el) => el.toLowerCase().includes(word));

            populateResults(subdiv, subresult);
        };
    };
});

// FUNCTIONS
function populateResults(div, list) {
    let childrens = [];

    list.forEach(element => {
        let lab = document.createElement("label");
        lab.innerText = element + "\n";
        childrens.push(lab);
    });

    if(list.length === 0) {
        let emptyLab = document.createElement("label");
        emptyLab.innerText = textFormEmptyFilter;
        childrens.push(emptyLab);
    };
    // replace all anyway
    div.replaceChildren(...childrens);
};

function populateMainFolder() {
    const mainFolderTitle = document.createElement("h3");
    mainFolderTitle.setAttribute("id", "mainFolderName");
    mainFolderTitle.innerText = info["mainPath"].split("\\").slice(-1);

    const mainFolderResults = document.createElement("div");
    mainFolderResults.setAttribute("id", "mainFolderResults");
    mainFolderResults.setAttribute("class", "mainFolder");
    mainFolderResults.setAttribute("path", info["mainPath"]);

    mainFolder.appendChild(mainFolderTitle);
    mainFolder.appendChild(mainFolderResults);

    populateResults(mainFolderResults, info["listFileMain"]);
};

function populateSubFolder() {
    info["listSubFolderFiles"].forEach(function(obj){
        let mainFolderName = info["mainPath"].split("\\").slice(-1);
        let listSubFolderPath = Object.keys(obj)[0].split("\\");
        let subFolderName = listSubFolderPath.slice(listSubFolderPath.indexOf(mainFolderName[0]) - listSubFolderPath.length).join(" / ");
        
        // create name tag
        const subFolderTitle = document.createElement("h3");
        subFolderTitle.setAttribute("id", subFolderName);
        subFolderTitle.innerText = subFolderName;

        // create conteiner for list of images
        const subFolderResults = document.createElement("div");
        subFolderResults.setAttribute("id", subFolderName);
        subFolderResults.setAttribute("class", "sub"+info["listSubFolderFiles"].indexOf(obj));
        subFolderResults.setAttribute("path", Object.keys(obj)[0]);

        subFolders.appendChild(subFolderTitle);
        subFolders.appendChild(subFolderResults);

        populateResults(subFolderResults, Object.values(obj)[0]);
    });
};

function showImages() {
    if(imageButton.disabled === false) {
        // work for main folder
        let labels = document.querySelectorAll(".mainFolder label");
        // check if get or not images
        if(labels[0].innerText != textFormEmptyFilter) {
            labels.forEach((label) => {
                let filePath = [info["mainPath"], label.innerText].join("\\");
                // add img tag
                let imgNode = document.createElement("img");
               imgNode.src = filePath;
               imgNode.onclick = copyImg;
               label.appendChild(imgNode);
            });
        };
        
        // work for subfolder
        if(info["hasSubFolder"]) {
            for(i=0; i<info["listSubFolderFiles"].length; i++) {
                let subLabels = document.querySelectorAll(`.sub${i} label`);
                // check if get or not images
                if(subLabels[0].innerText != textFormEmptyFilter) {
                    subLabels.forEach((subLabel) => {
                        let subFilePath = [Object.keys(info["listSubFolderFiles"][i])[0], subLabel.innerText].join("\\");
                        // add image tag
                        let subImgNode = document.createElement("img");
                        subImgNode.src = subFilePath;
                        subImgNode.onclick = copyImg;
                        subLabel.appendChild(subImgNode);
                    });
                };
            };
        };
    };
    imageButton.disabled = true; //button not clickable
};

function copyImg(el) {
    window.getSelection().removeAllRanges();

    let range = document.createRange();
    range.selectNode(el.target);
    window.getSelection().addRange(range);
    document.execCommand('copy');  // deprecated
    window.getSelection().removeAllRanges();

    window.alert("Imagem copiada!");
};

function settings() {
    if(window.confirm("Quer selecionar uma outra pasta onde procurar as imagens?")) {
        downloadBatch();
        window.alert("Ligar de novo o programa para atualizar");
        window.close();
    };
};

function downloadBatch() {
    newFile = new Blob([], {type:"text/pime"}); // create csv file object
	var tempLink = document.createElement("a"); // create temporary link
	tempLink.download = "resetFolderListFinder.pime";
	var url = window.URL.createObjectURL(newFile);
	tempLink.href = url;
	tempLink.display = "none";
	document.body.appendChild(tempLink);
	tempLink.click() //automatical trigger download
	document.body.removeChild(tempLink);
};