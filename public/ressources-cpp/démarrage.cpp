#include <iostream>
#include <cstdlib>
#include <windows.h>
#include "resource.h" 

int main() {

    HWND hwnd = GetConsoleWindow(); 

    HICON hIcon = LoadIcon(GetModuleHandle(NULL), MAKEINTRESOURCE(IDI_ICON1));
    SendMessage(hwnd, WM_SETICON, ICON_SMALL, (LPARAM)hIcon);
    SendMessage(hwnd, WM_SETICON, ICON_BIG, (LPARAM)hIcon);

    
    system("start cmd /c npm start");

    Sleep(2000); 

    HINSTANCE result = ShellExecute(0, 0, "http://localhost:3001/", 0, 0, SW_SHOW);

    return 0;
}
