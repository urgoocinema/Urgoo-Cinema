export default function changeBackground(color){
    document.querySelector('body').style.backgroundColor = color;
    document.getElementById('currColor').innerText = color;
}