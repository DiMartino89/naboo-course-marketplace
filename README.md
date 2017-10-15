# Naboo-Course-Marketplace

The plattform-prototype for creative and talented people!

# Quick Setup

MongoDB Setup (verwendete Version 3.2):

Schritt 1: Installation https://www.mongodb.com/de 
•	Standard-Pfad: C:\ProgramFiles\MongoDB\Server\3.2\.
Schritt 2: Data-Directory erstellen
•	Command Prompt öffnen und md \data\db ausführen
Schritt 3: MongoDB starten
•	cd C:\ProgramFiles\MongoDB\Server\3.2\bin\mongod.exe
Das Setup ist unter folgendem Link nochmal genauer beschrieben:  https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

NodeJS Setup (verwendete Version 7.5.0)

Schritt 1: Installation  https://nodejs.org/de/download/ 
•	Nach der Installation Versionskontrolle durchführen: node –v & npm –v
Das Setup ist unter folgendem Link nochmal genauer beschrieben: http://blog.teamtreehouse.com/install-node-js-npm-windows 

Naboo Setup

Schritt 1: Klonen der Github-Repository 
$ git clone https://github.com/DiMartino89/naboo-course-
marketplace.git 
Schritt 2: Concurrently-Modul für Anwendungs-Start im root-Verzeichnis installieren
•	$ npm install concurrently
Schritt 3: Anwendung aus dem root-Verzeichnis starten
$ npm start
