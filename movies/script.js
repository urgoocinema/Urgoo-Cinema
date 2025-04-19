const seatWrapper = document.querySelector('.seatWrapper');

const layout = [
    [5,5,5,5],
    [2,2,2,2],
    [5,5,5,5],
    [2,2,2,2],
    [5,5,5,5]
];
let seatHTML = '';

layout.forEach((row) =>{
    seatHTML+='<div class = "aisle">';
    for(let i = 0 ; i < row.length ; i++){
        seatHTML+='<div class = "row">';
        for(let j = 0 ; j < row[i] ; j++){
            seatHTML += '<div class = "seat"></div>'
        }
        seatHTML+='</div>';
    }
    seatHTML+='</div>';
});

seatWrapper.innerHTML+=seatHTML;


