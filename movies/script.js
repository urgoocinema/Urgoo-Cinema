const seatWrapper = document.querySelector('.seatWrapper');
const layout = [10,12,14,16,16,20,20,20,20,20,20,20,20,18,16];
let seatHTML = ''
for(let i = 0 ; i <layout.length ; i++){
    seatHTML+='<div class="row">';
    for(let j = 0 ; j < layout[i] ; j++){
        seatHTML += '<div class = "seat"></div>';
    }
    seatHTML+='</div>';
}
seatWrapper.innerHTML+=seatHTML;
