# Anforderungen - Quiz-App

### Must-Haves

- Es gibt eine Liste mit Kategorien
- Fragen / Kategorien können erstellen, bearbeiten und gelöscht werden
    - Kategorien werden implizit erstellt und werden indirekt gelöscht falls keine der Fragen in der Kategorie enthalten sind
    - Zum Erstellen, Bearbeiten und Löschen ist ein Github-Access-Token nötig ([tutorial](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token))
    - Frage bearbeiten, wenn diese Ausgewählt ist durch klicken auf Stift oben rechts
    - Frage löschen, wenn beim bearbeiten durch klicken auf Eimer oben rechts
    - Frage hinzufügen, wenn im Screen `Alle Fragen` durch klicken auf Plus oben rechts
- Fragentypen
    - Einfachauswahl
    - Mehrfachauswahl (Muss in den Einstellungen aktiviert werden)
    - Lückentext, 4 Buchstaben (Muss in den Einstellungen aktiviert werden)
    - Textantwort (Muss in den Einstellungen aktiviert werden)
- Auswahl einer Kategorie zeigt darin enthaltene Fragen
- Fragen-Modi
    - Es kann eine einzelne Frage gemacht werden, durch klicken auf die Frage im Screen `Alle Fragen`
    - Es kann eine Kategorie durchgearbeitet werden, durch klicken auf den Pfeil neben dem Namen der Kategorie rechts im Screen `Alle Fragen` (jede Frage wird einmal gemacht)
    - Es können zufällige Fragen aller Kategorien durchgearbeitet werden, im Screen `Zufällige Fragen` (Wiederholungen möglich)
    - Es können alle Fragen mit einer gewissen Statistik durchgearbeitet werden, durch klicken auf das Kuchendiagramm bzw. die Prozente im Screen `Statistik` (jede Frage wird einmal gemacht)
- Statistik
    - Jede Frage hat eine Indikation, ob diese falsch oder richtig beantwortet wurde, links neben jeder Frage im Screen `Alle Fragen`
    - Prozente, unten im Screen `Statistik`
    - Kuchendiagramm, oben im Screen `Statistik`
- Lokale Speicherung
    - Quiz wird lokal gespeichert und bei Internet Verbindung geupdated
    - Statistik wird lokal gespeichert
- Kommentierter Code
- Die App kann auf dem Desktop-Browser ausgeführt werden

### Nice-To-Have

- Accessability / Usability Features
    - Einstellungen im Menü Zahnrad oben rechts
    - Schriftgröße änderbar
    - Schriftart änderbar, default arial
    - Farben änderbar, default system
    - Startbildschirm festlegen, default alle Fragen
    - Fragetypen einstellbar
    - Stopuhr bei Fragen einstellbar, default deaktiviert
    - Der Nutzer wird informiert, falls ein Fehler aufgetreten ist
    - Ladeanimation wenn fragen geladen werden, im Screen `Alle Fragen`
- Fragen können kopiert werden, beim beantworten einer Frage durch klicken auf Büroklammer oben
- Änderungen der Fragen werden bei anderen Nutzer ebenfalls sichtbar nach neuem öffnen (verzögert)
- Splashscreen
- Die App kann durch einen in-App QR-Code geteilt werden, QR-Code button oben rechts in Einstellungen
- Es gibt Soundeffekte, beim Beantworten der Fragen bzw. Abwarten und einstellen der Lautstärke
- Jede Kategorie hat eine Indikation, über die Statistik dieser Kategorie, Leiste über der Kategorie im Screen `Alle Fragen`
- Hover effekt für Desktop-Browser
- Statistik kann zurückgesetzt werden, unten in Einstellungen
- App sieht auf jedem Gerät gleich aus
- Beim Beantworten einer Frage wird unten die Kategorie angezeigt, durch drauf-klicken navigiert zu Kategorie im Screen `Alle Fragen`
- Bei Eingabe des Github-Access-Token wird geprüft, ob der Zugriff möglich ist bzw. ein Token angegeben wurde
