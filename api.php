<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$host = 'localhost';
$dbname = 'retromoziadatb';
$user = 'retromoziadatb'; // XAMPP  felhasználó
$pass = 'Kd_1234';     // XAMPP jelszó

try {
    $dbh = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass, array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
} catch (PDOException $e) {
    echo json_encode(["hiba" => "Adatbázis csatlakozási hiba: " . $e->getMessage()]);
    die();
}


$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET': // READ - Összes film lekérdezése
        $stmt = $dbh->query("SELECT * FROM filmek ORDER BY id ASC");
        $filmek = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($filmek);
        break;

    case 'POST': // CREATE - Új film hozzáadása
        if(isset($input['cim']) && isset($input['ev']) && isset($input['hossz'])) {
            $stmt = $dbh->prepare("INSERT INTO filmek (cim, ev, hossz) VALUES (:cim, :ev, :hossz)");
            $stmt->execute(['cim' => $input['cim'], 'ev' => $input['ev'], 'hossz' => $input['hossz']]);
            echo json_encode(["uzenet" => "Sikeres hozzáadás!"]);
        } else {
            echo json_encode(["hiba" => "Hiányzó adatok!"]);
        }
        break;

    case 'PUT': // UPDATE - Film módosítása
        if(isset($input['id']) && isset($input['cim']) && isset($input['ev']) && isset($input['hossz'])) {
            $stmt = $dbh->prepare("UPDATE filmek SET cim = :cim, ev = :ev, hossz = :hossz WHERE id = :id");
            $stmt->execute(['cim' => $input['cim'], 'ev' => $input['ev'], 'hossz' => $input['hossz'], 'id' => $input['id']]);
            echo json_encode(["uzenet" => "Sikeres módosítás!"]);
        } else {
            echo json_encode(["hiba" => "Hiányzó adatok!"]);
        }
        break;

    case 'DELETE': // DELETE - Film törlése
        if(isset($input['id'])) {
            $stmt = $dbh->prepare("DELETE FROM filmek WHERE id = :id");
            $stmt->execute(['id' => $input['id']]);
            echo json_encode(["uzenet" => "Sikeres törlés!"]);
        } else {
            echo json_encode(["hiba" => "Hiányzó azonosító!"]);
        }
        break;
}
?>