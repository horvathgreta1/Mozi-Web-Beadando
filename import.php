<?php
// Adatbázis kapcsolat
$host = 'localhost';
$dbname = 'retromoziadatb';
$user = 'retromoziadatb'; // XAMPP  felhasználó
$pass = 'Kd_1234';     // XAMPP jelszó

try {
    // Kapcsolódás az adatbázishoz
    $dbh = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- 0. LÉPÉS: TÁBLÁK LÉTREHOZÁSA (HA MÉG NINCSENEK) ---
    $dbh->exec("
        CREATE TABLE IF NOT EXISTS `mozi` (
          `id` int(11) NOT NULL,
          `nev` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
          `varos` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
          `ferohely` int(11) NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

        CREATE TABLE IF NOT EXISTS `film` (
          `id` int(11) NOT NULL,
          `cim` varchar(200) COLLATE utf8_hungarian_ci NOT NULL,
          `ev` int(4) NOT NULL,
          `hossz` int(11) NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

        CREATE TABLE IF NOT EXISTS `eloadas` (
          `filmid` int(11) NOT NULL,
          `moziid` int(11) NOT NULL,
          `datum` date NOT NULL,
          `nezoszam` int(11) NOT NULL,
          `bevetel` int(11) NOT NULL,
          KEY `filmid` (`filmid`),
          KEY `moziid` (`moziid`),
          CONSTRAINT `fk_film` FOREIGN KEY (`filmid`) REFERENCES `film` (`id`) ON DELETE CASCADE,
          CONSTRAINT `fk_mozi` FOREIGN KEY (`moziid`) REFERENCES `mozi` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
    ");

    // 1. Töröljük a táblák eddigi tartalmát, hogy teljesen tiszta lappal induljunk
    $dbh->exec("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE eloadas; TRUNCATE TABLE film; TRUNCATE TABLE mozi; SET FOREIGN_KEY_CHECKS = 1;");

    $statisztika = ['mozi' => 0, 'film' => 0, 'eloadas' => 0];

    // --- 2. MOZIK BEOLVASÁSA ---
    if (file_exists("mozi.txt")) {
        $file = fopen("mozi.txt", "r");
        fgets($file); // Fejléc átugrása
        $stmt = $dbh->prepare("INSERT INTO mozi (id, nev, varos, ferohely) VALUES (?, ?, ?, ?)");
        $dbh->beginTransaction();
        while (($line = fgets($file)) !== false) {
            $line = trim($line);
            if (empty($line)) continue;
            
            $adatok = explode("\t", $line);
            if (count($adatok) >= 4) {
                $stmt->execute([trim($adatok[0]), trim($adatok[1]), trim($adatok[2]), trim($adatok[3])]);
                $statisztika['mozi']++;
            }
        }
        $dbh->commit();
        fclose($file);
    }

    // --- 3. FILMEK BEOLVASÁSA ---
    if (file_exists("film.txt")) {
        $file = fopen("film.txt", "r");
        fgets($file); 
        $stmt = $dbh->prepare("INSERT INTO film (id, cim, ev, hossz) VALUES (?, ?, ?, ?)");
        $dbh->beginTransaction();
        while (($line = fgets($file)) !== false) {
            $line = trim($line);
            if (empty($line)) continue;
            
            $adatok = explode("\t", $line);
            if (count($adatok) >= 4) {
                $stmt->execute([trim($adatok[0]), trim($adatok[1]), trim($adatok[2]), trim($adatok[3])]);
                $statisztika['film']++;
            }
        }
        $dbh->commit();
        fclose($file);
    }

    // --- 4. ELŐADÁSOK BEOLVASÁSA ---
    if (file_exists("eloadas.txt")) {
        $file = fopen("eloadas.txt", "r");
        fgets($file); 
        $stmt = $dbh->prepare("INSERT INTO eloadas (filmid, moziid, datum, nezoszam, bevetel) VALUES (?, ?, ?, ?, ?)");
        $dbh->beginTransaction();
        while (($line = fgets($file)) !== false) {
            $line = trim($line);
            if (empty($line)) continue;
            
            $adatok = preg_split('/\s+/', $line);
            if (count($adatok) >= 5) {
                $datum = str_replace('.', '-', trim($adatok[2]));
                $stmt->execute([trim($adatok[0]), trim($adatok[1]), $datum, trim($adatok[3]), trim($adatok[4])]);
                $statisztika['eloadas']++;
            }
        }
        $dbh->commit();
        fclose($file);
    }

    // --- SIKERES ÜZENET ---
    echo "<div style='font-family: Arial; padding: 20px; background-color: #1e1e1e; color: #FFD700; border-radius: 10px; width: 400px; margin: 50px auto; text-align: center;'>";
    echo "<h1>🎉 SIKERES IMPORTÁLÁS!</h1>";
    echo "<p style='color: white;'>A táblák és az adatok is a helyükön vannak.</p>";
    echo "<ul style='text-align: left; color: #aaa;'>";
    echo "<li><strong>Mozik:</strong> " . $statisztika['mozi'] . " db</li>";
    echo "<li><strong>Filmek:</strong> " . $statisztika['film'] . " db</li>";
    echo "<li><strong>Előadások:</strong> " . $statisztika['eloadas'] . " db</li>";
    echo "</ul>";
    echo "</div>";

} catch (PDOException $e) {
    if (isset($dbh) && $dbh->inTransaction()) $dbh->rollBack();
    echo "<h2 style='color: red;'>Hiba történt: " . $e->getMessage() . "</h2>";
}
?>