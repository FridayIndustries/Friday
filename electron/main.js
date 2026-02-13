const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Configuration du moteur de rendu - Améliore la stabilité sur Windows
app.commandLine.appendSwitch('use-angle', 'd3d11');
app.commandLine.appendSwitch('enable-features', 'Vulkan');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

// Configuration de l'identifiant unique pour le regroupement dans la barre des tâches
try {
    if (process.platform === 'win32') {
        app.setAppUserModelId('com.friday.app');
    }
} catch (e) {
    console.error('Erreur lors de la configuration de AppUserModelId:', e?.message);
}

let mainWindow;
let pythonProcess;
let windowWasShown = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Adapté pour l'usage IPC/Socket.IO simplifié
        },
        // Utilisation de l'icône dans electron/assets
        icon: path.join(__dirname, 'assets', 'icon.png'),
        backgroundColor: '#000000',
        frame: false, // Fenêtre sans bordure pour interface personnalisée
        titleBarStyle: 'hidden',
        show: false, // Affichage après chargement complet
    });

    const isDev = process.env.NODE_ENV !== 'production';

    const loadFrontend = (retries = 3) => {
        const url = isDev ? 'http://localhost:5173' : null;
        const loadPromise = isDev
            ? mainWindow.loadURL(url)
            : mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

        loadPromise
            .then(() => {
                console.log('Frontend chargé avec succès !');
                windowWasShown = true;
                mainWindow.show();
                if (isDev) {
                    mainWindow.webContents.closeDevTools();
                }
            })
            .catch((err) => {
                console.error(`Échec du chargement du frontend: ${err.message}`);
                if (retries > 0) {
                    console.log(`Nouvelle tentative dans 1 seconde... (${retries} restantes)`);
                    setTimeout(() => loadFrontend(retries - 1), 1000);
                } else {
                    console.error('Échec définitif du chargement. Maintien de la fenêtre ouverte.');
                    windowWasShown = true;
                    mainWindow.show();
                }
            });
    };

    loadFrontend();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startPythonBackend() {
    const scriptPath = path.join(__dirname, '../backend/server.py');
    console.log(`Démarrage du backend Python: ${scriptPath}`);

    // Exécute le script Python présent dans le dossier backend
    pythonProcess = spawn('python', [scriptPath], {
        cwd: path.join(__dirname, '../backend'),
    });

    pythonProcess.stdout.on('data', (data) => {
        console.log(`[Python]: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`[Erreur Python]: ${data}`);
    });
}

// --- Initialisation de l'application ---

app.whenReady().then(() => {
    // Événements IPC pour le contrôle de la fenêtre (Minimize/Maximize/Close)
    ipcMain.on('window-minimize', () => {
        if (mainWindow) mainWindow.minimize();
    });

    ipcMain.on('window-maximize', () => {
        if (mainWindow) {
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        }
    });

    ipcMain.on('window-close', () => {
        if (mainWindow) mainWindow.close();
    });

    // Gestion de la connexion au backend
    checkBackendPort(8000).then((isTaken) => {
        if (isTaken) {
            console.log('Port 8000 occupé. Le backend est probablement déjà actif.');
            waitForBackend().then(createWindow);
        } else {
            startPythonBackend();
            setTimeout(() => {
                waitForBackend().then(createWindow);
            }, 1000);
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// --- Utilitaires de vérification ---

function checkBackendPort(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();
        server.once('error', (err) => {
            resolve(err.code === 'EADDRINUSE');
        });
        server.once('listening', () => {
            server.close();
            resolve(false);
        });
        server.listen(port);
    });
}

function waitForBackend() {
    return new Promise((resolve) => {
        const check = () => {
            const http = require('http');
            http.get('http://127.0.0.1:8000/status', (res) => {
                if (res.statusCode === 200) {
                    console.log('Le backend est prêt !');
                    resolve();
                } else {
                    console.log('Backend non prêt, nouvelle tentative...');
                    setTimeout(check, 1000);
                }
            }).on('error', () => {
                console.log('Attente du backend...');
                setTimeout(check, 1000);
            });
        };
        check();
    });
}

app.on('window-all-closed', () => {
    // On ne quitte que si la fenêtre a été affichée au moins une fois
    if (process.platform !== 'darwin' && windowWasShown) {
        app.quit();
    } else if (!windowWasShown) {
        console.log('La fenêtre n\'a jamais été affichée - maintien de l\'app pour tentatives');
    }
});

app.on('will-quit', () => {
    console.log('Fermeture de l\'application... Arrêt du backend.');
    if (pythonProcess) {
        if (process.platform === 'win32') {
            try {
                const { execSync } = require('child_process');
                execSync(`taskkill /pid ${pythonProcess.pid} /f /t`);
            } catch (e) {
                console.error('Échec de l\'arrêt du processus Python:', e.message);
            }
        } else {
            pythonProcess.kill('SIGKILL');
        }
        pythonProcess = null;
    }
});