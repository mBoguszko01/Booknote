document.addEventListener('input', function (e) {
    if (e.target.tagName.toLowerCase() === 'textarea') {
        autoExpand(e.target);
    }
});
function autoExpand(textarea) {
    // Ustawienie wysokości textarea na domyślną wartość, aby sprawdzić naturalną wysokość
    textarea.style.height = '250px';
    
    // Ustawienie wysokości textarea na jego scrollHeight, aby zastosować rzeczywistą wysokość tekstu
    textarea.style.height = textarea.scrollHeight + 'px';
}