var display = 1;

function hideShow(popUpID) 
{
    var div = document.getElementById(popUpID);
    if(display == 1) {
        div.style.display = 'block';
        display = 0;
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
        
        div.style.display = 'none';
        display = 1;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
