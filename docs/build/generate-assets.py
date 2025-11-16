#!/usr/bin/env python3
"""
Gera assets PNG válidos para o MindBudget
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    
    # Cor principal do MindBudget
    COLOR = (79, 70, 229)  # #4F46E5
    WHITE = (255, 255, 255)
    
    # 1. Icon (1024x1024)
    icon = Image.new('RGB', (1024, 1024), COLOR)
    draw = ImageDraw.Draw(icon)
    # Desenhar um círculo branco no centro
    draw.ellipse([312, 312, 712, 712], fill=WHITE)
    # Texto MB
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 200)
    except:
        font = ImageFont.load_default()
    draw.text((512, 512), "MB", fill=COLOR, anchor="mm", font=font)
    icon.save('assets/icon.png', 'PNG')
    print("✅ icon.png criado")
    
    # 2. Adaptive Icon (1024x1024)
    adaptive = Image.new('RGB', (1024, 1024), COLOR)
    draw = ImageDraw.Draw(adaptive)
    draw.ellipse([256, 256, 768, 768], fill=WHITE)
    draw.text((512, 512), "MB", fill=COLOR, anchor="mm", font=font)
    adaptive.save('assets/adaptive-icon.png', 'PNG')
    print("✅ adaptive-icon.png criado")
    
    # 3. Splash Screen (1284x2778)
    splash = Image.new('RGB', (1284, 2778), COLOR)
    draw = ImageDraw.Draw(splash)
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 150)
    except:
        font_large = font
    draw.text((642, 1389), "MindBudget", fill=WHITE, anchor="mm", font=font_large)
    splash.save('assets/splash.png', 'PNG')
    print("✅ splash.png criado")
    
    # 4. Notification Icon (96x96 - white on transparent)
    notification = Image.new('RGBA', (96, 96), (0, 0, 0, 0))
    draw = ImageDraw.Draw(notification)
    # Desenhar ícone simples branco
    draw.ellipse([16, 16, 80, 80], fill=WHITE)
    try:
        font_notif = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    except:
        font_notif = ImageFont.load_default()
    draw.text((48, 48), "M", fill=COLOR, anchor="mm", font=font_notif)
    notification.save('assets/notification-icon.png', 'PNG')
    print("✅ notification-icon.png criado")
    
    print("\n🎉 Todos os assets foram criados com sucesso!")
    
except ImportError:
    print("❌ PIL/Pillow não está instalado")
    print("Instalando Pillow...")
    import subprocess
    subprocess.run(["pip3", "install", "Pillow"])
    print("Execute o script novamente")
