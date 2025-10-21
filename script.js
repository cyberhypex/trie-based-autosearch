// @ts-nocheck
class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
}
class TrieImplementation {
    constructor() {
        this.root = new TrieNode();
    }
    //this method inserts all words into the trie
    insert(word) {
        let nodeOfTrie = this.root;
        for (let ch of word) {
            if (!nodeOfTrie.children[ch]) {
                nodeOfTrie.children[ch] = new TrieNode();
            }
            nodeOfTrie = nodeOfTrie.children[ch];
        }
        nodeOfTrie.isEnd = true;
    }
    //method to search for any word starting with or matching
    startsWith(prefix) {
        let nodeOfPrefix = this.root;
        for (let ch of prefix) {
            if (!nodeOfPrefix.children[ch]) return [];
            nodeOfPrefix = nodeOfPrefix.children[ch];
        }
        const resultsOfPrefixMatching = [];
        this._dfs(nodeOfPrefix, prefix, resultsOfPrefixMatching);
        return resultsOfPrefixMatching;
    }

    _dfs(nodeToSearchDown, prefix, resultsObject) {
        if (resultsObject.length >= 10) return;
        if (nodeToSearchDown.isEnd) {
            resultsObject.push(prefix);
        }
        for (let ch in nodeToSearchDown.children) {
            this._dfs(nodeToSearchDown.children[ch], prefix + ch, resultsObject);
        }
    }
}

//storing of default words for predicting beforehand
const STORAGE_KEY = "search_predictions";
const preDefinedWords = ["apple", "ball", "cat", "dog", "elephant", "fan", "google", "hindi", "iris", "jelly"];
let storedDeafultWords = JSON.parse(localStorage.getItem(STORAGE_KEY)) || preDefinedWords.slice();

const trie = new TrieImplementation();
storedDeafultWords.forEach(word => trie.insert(word.toLowerCase()));


//working on the funcitonality of the UI
const inputFromUser = document.getElementById("searchBox");
const suggestionForNextWords = document.getElementById("suggestions");

inputFromUser.addEventListener("input", () => {
    const querySearch = inputFromUser.value.toLowerCase().trim(); 
    suggestionForNextWords.innerHTML = "";
    if (!querySearch) return;

    const wordsFromQuery = querySearch.split(/\s+/);
    const lastWordOfQueryToMatch = wordsFromQuery[wordsFromQuery.length - 1];
    const matchingWords = trie.startsWith(lastWordOfQueryToMatch);

    matchingWords.forEach(match => {
        const listCreation = document.createElement("li");
        listCreation.textContent = match;
        listCreation.addEventListener("mousedown", e => {
            e.preventDefault();
            wordsFromQuery[wordsFromQuery.length - 1] = match;
            inputFromUser.value = wordsFromQuery.join(" ") + " ";
            suggestionForNextWords.innerHTML = "";
            addToLocalStorage(match);
        });
        suggestionForNextWords.appendChild(listCreation);
    });
});

inputFromUser.addEventListener("keydown", e => { 
    if (e.key === " " || e.key === "Enter") {
        const text = inputFromUser.value.trim();
        if (text.length === 0) return;
        const words = text.split(/\s+/);
        const lastWord = words[words.length - 1].toLowerCase();
        addToLocalStorage(lastWord);
    }
});

function addToLocalStorage(word) {
    if (!storedDeafultWords.includes(word)) { 
        storedDeafultWords.push(word);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedDeafultWords));
        trie.insert(word);
    }
}
