#include <iostream>
#include <cstdlib>
#include <windows.h>
#include "resource.h"  // Inclure le fichier d'en-tête des ressources

int main() {
    // Créer une fenêtre principale (optionnel si vous n'avez pas de fenêtre GUI)
    HWND hwnd = GetConsoleWindow(); // Si vous n'avez pas de fenêtre graphique, vous pouvez utiliser la fenêtre de la console.

    // Assigner l'icône à la fenêtre
    HICON hIcon = LoadIcon(GetModuleHandle(NULL), MAKEINTRESOURCE(IDI_ICON1));
    SendMessage(hwnd, WM_SETICON, ICON_SMALL, (LPARAM)hIcon);
    SendMessage(hwnd, WM_SETICON, ICON_BIG, (LPARAM)hIcon);

    // Exécute la commande batch dans une nouvelle fenêtre pour démarrer le serveur
    system("start cmd /c npm start");

    // Pause pour laisser le temps au serveur de démarrer
    Sleep(2000); // Augmentez le délai si nécessaire

    // Ouvre l'URL avec Mozilla Firefox (si installé)
    HINSTANCE result = ShellExecute(0, 0, "http://localhost:3001/", 0, 0, SW_SHOW);

    return 0;
}
