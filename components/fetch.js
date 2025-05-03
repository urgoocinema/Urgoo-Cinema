export default async function fetchMovies() {
    try {
        const response = await fetch("./data/ongoing/movies-list.json");
        if (!response.ok) {
        throw new Error("Сүлжээний хүсэлт амжилтгүй." + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Мэдээлэл татаж чадсангүй. Алдааны мессеж:", error);
    }
}