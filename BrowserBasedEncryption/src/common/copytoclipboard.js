document.querySelector('#copy-button').addEventListener('click', function() {
	var text = document.getElementById('cipher');
	chrome.extension.sendMessage({ text: text.innerText });

});