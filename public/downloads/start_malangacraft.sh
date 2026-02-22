#!/bin/bash
set -e

SERVER_IP="malangacraft.dot0x.com"
INSTANCE_NAME="MalangaCraft"
MC_VERSION="1.21.1"
FABRIC_LOADER="net.fabricmc.fabric-loader"
FABRIC_VERSION="0.16.9"

VOICECHAT_JAR="voicechat-fabric-1.21.1-2.6.12.jar"
VOICECHAT_URL="https://edge.forgecdn.net/files/7614/32/$VOICECHAT_JAR"

# Detect Prism Launcher data path
if [ -d "$HOME/.local/share/PrismLauncher" ]; then
    PRISM_DATA="$HOME/.local/share/PrismLauncher"
elif [ -d "$HOME/.var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher" ]; then
    PRISM_DATA="$HOME/.var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher"
elif [ -d "$HOME/Library/Application Support/PrismLauncher" ]; then
    PRISM_DATA="$HOME/Library/Application Support/PrismLauncher"
else
    echo "ERROR: No se encontro PrismLauncher."
    echo "Instala Prism Launcher desde https://prismlauncher.org"
    exit 1
fi

INSTANCES="$PRISM_DATA/instances"
INST="$INSTANCES/$INSTANCE_NAME"
MC_DIR="$INST/.minecraft"
MODS_DIR="$MC_DIR/mods"

echo ""
echo "=== MalangaCraft Installer ==="
echo "Creando instancia $INSTANCE_NAME en Prism Launcher..."
mkdir -p "$MODS_DIR"

# instance.cfg (INI format required by Prism)
cat > "$INST/instance.cfg" <<EOF
InstanceType=OneSix
name=$INSTANCE_NAME
iconKey=default
EOF

# mmc-pack.json tells Prism which MC version + loader to use
cat > "$INST/mmc-pack.json" <<EOF
{
  "formatVersion": 1,
  "components": [
    { "uid": "net.minecraft", "version": "$MC_VERSION", "important": true },
    { "uid": "$FABRIC_LOADER", "version": "$FABRIC_VERSION" }
  ]
}
EOF

# Download Simple Voice Chat if missing
if [ ! -f "$MODS_DIR/$VOICECHAT_JAR" ]; then
    echo "Descargando Simple Voice Chat mod..."
    curl -L --progress-bar -o "$MODS_DIR/$VOICECHAT_JAR" "$VOICECHAT_URL"
else
    echo "Voice Chat mod ya existe, skipping."
fi

# Pre-add server to servers.dat via NBT is complex;
# instead create a simple text reminder
cat > "$MC_DIR/server-ip.txt" <<EOF
Agrega este server en Multiplayer > Add Server:
  Server Name: MalangaCraft
  Server Address: $SERVER_IP
EOF

echo ""
echo "Instancia creada! Abre Prism Launcher, selecciona '$INSTANCE_NAME' y dale Launch."
echo "Luego ve a Multiplayer > Add Server y pon: $SERVER_IP"
echo ""

# Try to open Prism Launcher
if command -v prismlauncher &> /dev/null; then
    prismlauncher &
elif command -v prism-launcher &> /dev/null; then
    prism-launcher &
elif [ -x "/usr/bin/prismlauncher" ]; then
    /usr/bin/prismlauncher &
else
    echo "Abre Prism Launcher manualmente."
fi
