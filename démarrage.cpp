#include <iostream>
#include <cstdlib>
#include <windows.h>

int main() {
    // Exécute la commande batch dans une nouvelle fenêtre pour démarrer le serveur
    system("start cmd /c npm start");

    // Pause pour laisser le temps au serveur de démarrer
    Sleep(2000); // Augmentez le délai si nécessaire

    // Ouvre l'URL avec Mozilla Firefox (si installé)
    HINSTANCE result = ShellExecute(0, 0, "http://localhost:3001/", 0, 0, SW_SHOW);

    return 0;
}
