#!/usr/bin/env python3
"""Generate Isabella OS Commercial Pack (SFW) + Exclusivity ESL HOT Pack PDFs."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, ListFlowable, ListItem, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

INK = HexColor("#14110E")
GOLD = HexColor("#C4A574")
CREAM = HexColor("#F3EDE4")
MUTED = HexColor("#8A7A68")
SURFACE = HexColor("#1C1814")
LINE = HexColor("#3A332C")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm

# ─── Canonical Identity ───────────────────────────────────────────────
IDENTITY_CORE = (
    "Adult Brazilian woman, 22 years old, exact same person as the reference image, "
    "facial identity lock: warm jambo golden-brown skin with natural sun-kissed undertones, "
    "subtle freckles across the nose and cheeks, green-hazel almond-shaped eyes with long natural lashes, "
    "oval feminine face, defined cheekbones, naturally full lips with a clear cupid's bow, "
    "proportionate nose, realistic facial asymmetry, authentic skin texture with visible pores "
    "and subtle natural imperfections, long dark brown 3C curly-to-wavy hair with natural volume "
    "and individual strands, naturally curvy feminine adult body proportions, photorealistic human "
    "appearance, authentic Brazilian beauty, sophisticated and approachable presence"
)

BODY_LOCK = (
    "realistic feminine adult body proportions, naturally curvy silhouette, realistic waist-to-hip ratio, "
    "natural abdomen, subtle hip dips, natural thighs, realistic body asymmetry, authentic skin texture, "
    "no exaggerated anatomy"
)

NEGATIVE = (
    "generic AI face, different person, altered facial structure, inconsistent eyes, inconsistent nose, "
    "inconsistent lips, plastic skin, waxy skin, excessive beauty retouching, doll-like appearance, "
    "unrealistic body proportions, distorted anatomy, extra fingers, malformed hands, duplicated jewelry, "
    "artificial hair, excessive HDR, oversharpening, CGI, cartoon, text artifacts, watermark, logo distortion, "
    "underage, child, teen, minor"
)

TECH_TAIL = (
    "photorealistic, authentic human appearance, realistic skin texture, natural anatomy, "
    "realistic hair strands, subtle facial asymmetry, physically plausible lighting, "
    "realistic depth of field, high-end commercial photography"
)

MODULES = {
    "A": ("Natural / Base", "natural dark brown 3C wavy-curly hair with medium volume, minimal natural makeup, authentic skin texture, understated gold hoop earrings, clean everyday look"),
    "B": ("Glamour", "long voluminous dark brown waves, polished hairstyle, refined natural makeup with soft glow, subtle luxury gold jewelry, sophisticated elegant styling"),
    "C": ("Editorial", "voluminous textured dark hair, elevated editorial styling, refined makeup, distinctive statement jewelry, high-fashion aesthetic, sharp intentional presence"),
    "D": ("Carioca / Lifestyle", "naturally textured dark 3C curly hair, sun-kissed golden-brown skin, minimal makeup, relaxed Brazilian summer styling, effortless warm presence"),
    "E": ("ESL Signature", "highly styled dark textured hair with controlled blue-green accent details, sophisticated modern makeup, subtle brand-signature look, elevated commercial presence"),
}

VIDEO_LOCK = "the exact same woman from the reference image, perfect facial consistency, identical face structure, 22-year-old adult, no face morph"


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name="CoverTitle", fontName="Times-Bold", fontSize=28, leading=34,
        textColor=CREAM, alignment=TA_CENTER, spaceAfter=8
    ))
    styles.add(ParagraphStyle(
        name="CoverSub", fontName="Helvetica", fontSize=11, leading=15,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        name="CoverMuted", fontName="Helvetica", fontSize=9, leading=12,
        textColor=MUTED, alignment=TA_CENTER, spaceAfter=4
    ))
    styles.add(ParagraphStyle(
        name="H1", fontName="Times-Bold", fontSize=16, leading=20,
        textColor=GOLD, spaceBefore=14, spaceAfter=8
    ))
    styles.add(ParagraphStyle(
        name="H2", fontName="Times-Bold", fontSize=13, leading=16,
        textColor=CREAM, spaceBefore=10, spaceAfter=5
    ))
    styles.add(ParagraphStyle(
        name="H3", fontName="Helvetica-Bold", fontSize=10, leading=13,
        textColor=GOLD, spaceBefore=8, spaceAfter=3
    ))
    styles.add(ParagraphStyle(
        name="Body", fontName="Helvetica", fontSize=9, leading=12.5,
        textColor=CREAM, alignment=TA_JUSTIFY, spaceAfter=4
    ))
    styles.add(ParagraphStyle(
        name="BodySmall", fontName="Helvetica", fontSize=8, leading=11,
        textColor=CREAM, spaceAfter=3
    ))
    styles.add(ParagraphStyle(
        name="Prompt", fontName="Courier", fontSize=7.5, leading=10,
        textColor=CREAM, spaceAfter=6, leftIndent=2, rightIndent=2
    ))
    styles.add(ParagraphStyle(
        name="Label", fontName="Helvetica-Bold", fontSize=8, leading=10,
        textColor=GOLD, spaceBefore=6, spaceAfter=2
    ))
    styles.add(ParagraphStyle(
        name="Muted", fontName="Helvetica", fontSize=8, leading=11,
        textColor=MUTED, spaceAfter=3
    ))
    styles.add(ParagraphStyle(
        name="Footer", fontName="Helvetica", fontSize=7, leading=9,
        textColor=MUTED, alignment=TA_CENTER
    ))
    styles.add(ParagraphStyle(
        name="TOC", fontName="Helvetica", fontSize=9, leading=14,
        textColor=CREAM, spaceAfter=2
    ))
    return styles


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN, PAGE_H - 12 * mm, PAGE_W - MARGIN, PAGE_H - 12 * mm)
    canvas.line(MARGIN, 12 * mm, PAGE_W - MARGIN, 12 * mm)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, PAGE_H - 9 * mm, "ISABELLA OS · EddY Digital Solutions")
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 9 * mm, "22+ · Commercial")
    canvas.drawCentredString(PAGE_W / 2, 7 * mm, f"{doc.page}")
    canvas.restoreState()


def header_footer_hot(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(HexColor("#B85C5C"))
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN, PAGE_H - 12 * mm, PAGE_W - MARGIN, PAGE_H - 12 * mm)
    canvas.line(MARGIN, 12 * mm, PAGE_W - MARGIN, 12 * mm)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, PAGE_H - 9 * mm, "EXCLUSIVITY ESL · 18+ ONLY")
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 9 * mm, "Adult · Separate Product")
    canvas.drawCentredString(PAGE_W / 2, 7 * mm, f"{doc.page}")
    canvas.restoreState()


def hr():
    return HRFlowable(width="100%", thickness=0.5, color=GOLD, spaceBefore=6, spaceAfter=8)


def prompt_block(styles, title, text):
    return KeepTogether([
        Paragraph(title, styles["Label"]),
        Paragraph(text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), styles["Prompt"]),
    ])


def assemble(scene, module_key="A", ar="9:16"):
    mod = MODULES[module_key][1]
    return f"{IDENTITY_CORE}, {mod}, {BODY_LOCK}, {scene}, aspect ratio {ar}, {TECH_TAIL}"


# ─── SFW scenes ───────────────────────────────────────────────────────
SFW_SCENES = {
    "Lifestyle": [
        ("Mirror selfie — quarto", "A", "taking a mirror selfie in a bright modern bedroom, holding a smartphone, natural soft window light, wearing a simple white off-shoulder top and gold layered necklaces, soft smile, casual lifestyle, realistic phone reflection"),
        ("Home office", "A", "sitting at a white desk in a bright minimalist room, holding a light blue smartphone for a selfie, white off-shoulder blouse, plants in the background, warm daylight, looking at the camera"),
        ("Varanda noturna", "A", "standing on a balcony at night overlooking city lights, holding a clear cup, wearing a sage sports bra and white shorts, soft night lighting, relaxed confident urban lifestyle"),
        ("Car selfie", "A", "sitting in the passenger seat of a car, natural daylight, black t-shirt, looking at the camera, one hand lightly touching her hair, realistic car interior"),
        ("Cozinha de manhã", "A", "standing in a bright modern kitchen, holding a white ceramic mug with both hands, oversized beige linen shirt, morning window light, soft smile"),
        ("Pós-treino", "A", "sitting on a gym bench after workout, black sports bra and high-waisted leggings, towel over one shoulder, light sweat on skin, natural lighting, confident fitness lifestyle"),
        ("Café / livraria", "A", "sitting at a wooden table in a cozy bookstore café, holding an open book, cream knit sweater and gold hoop earrings, soft window light, calm intellectual aesthetic"),
        ("Janela com chuva", "A", "standing by a large window on a rainy day, white oversized hoodie, looking outside with a contemplative expression, raindrops on the glass, moody natural light"),
        ("Sofá da sala", "A", "sitting cross-legged on a linen sofa, oversized oatmeal sweater, holding a mug, afternoon light, cozy home portrait"),
        ("Mercado / feira", "A", "walking through an outdoor food market, white tank and high-waisted jeans, tote bag on shoulder, bright daylight, candid lifestyle"),
    ],
    "Fashion": [
        ("Black halter rooftop", "B", "full body, black halter crop top with gold ring detail and matching mini skirt, rooftop at golden hour, city view, elegant pose, heels, cinematic lighting"),
        ("Vestido ombro só", "B", "standing outdoors at sunset near water, olive green one-shoulder mini dress with white floral print, soft smile, golden hour, realistic fabric"),
        ("Crop vermelho + saia", "B", "mirror selfie in a bright living room, red short-sleeve crop top and white pleated mini skirt, holding a pink smartphone, gold jewelry, casual fashion"),
        ("All black poder", "B", "full body, tailored black blazer over black top, high-waisted black trousers, gold jewelry, minimalist concrete hallway, one hand in pocket, powerful fashion pose"),
        ("Vestido branco praia", "D", "walking on a wooden boardwalk, flowing white midi dress with thin straps, wind moving fabric and hair, golden hour, soft smile"),
        ("Street leather", "B", "city sidewalk at dusk, oversized vintage leather jacket over white t-shirt and baggy jeans, gold necklaces, confident stance, street lights"),
        ("Vestido vermelho indoor", "B", "sitting on a modern chair in a luxurious living room, structured red mini dress with thin straps, legs crossed, elegant posture, soft indoor lighting"),
        ("Monocromático bege", "C", "full body, beige tailored waistcoat and matching wide-leg trousers, clean white wall, minimal jewelry, modern high-fashion, soft studio light"),
        ("Paetê night", "B", "standing in front of a mirror in a dim room, silver sequin mini dress, one hand adjusting hair, party-ready fashion, ambient reflections"),
        ("Tailleur branco", "C", "full body, crisp white tailored suit, open blazer over a simple top, marble lobby, editorial fashion, hard daylight from a skylight"),
    ],
    "Night Out + Urban": [
        ("Rooftop bar", "B", "rooftop bar at night, city skyline, black satin slip dress with thin straps, gold hoops and layered necklaces, holding a glass, cinematic lighting"),
        ("Entrada do clube", "B", "nightclub entrance with neon lights, tailored black mini dress, heels, one hand on hip, dramatic lighting, urban nightlife"),
        ("Selfie no elevador", "B", "mirror selfie inside a modern elevator with gold and black interiors, red dress, holding a black smartphone, luxury night-out mood"),
        ("After hotel", "B", "walking down a luxurious hotel corridor at night, sequin silver mini dress and black heels, looking back over her shoulder with a playful smile"),
        ("Graffiti wall", "A", "leaning against a colorful graffiti wall, cropped denim jacket, black tank and mini skirt, one hand in hair, daylight street style"),
        ("Atravessando a rua", "C", "mid-stride crossing a city street, tailored beige blazer over black top and wide-leg trousers, heels, golden hour"),
        ("Garagem", "A", "modern parking garage with concrete pillars, cropped black hoodie and high-waisted pants, sneakers, dramatic side lighting"),
        ("Café noturno", "B", "outdoor café table at night, dark green satin blouse and black trousers, holding a glass, soft ambient lighting"),
    ],
    "Beach + Travel": [
        ("Deck de madeira", "D", "sitting on a wooden dock by calm water, black one-piece swimsuit with full coverage, one hand touching hair, gold watch, natural sunlight, realistic water reflections"),
        ("Andando na areia", "D", "walking barefoot on a sandy beach toward camera, white and green patterned swimsuit cover-up, wind in hair, golden hour, carefree beach vibe"),
        ("Cadeira de praia", "D", "lying on a wooden beach chair under a palm tree, light blue cover-up, sunglasses on her head, soft light through leaves"),
        ("Água rasa", "D", "standing in shallow clear water, modest one-piece swimsuit, water to mid-thigh, soft smile, sunlight on water"),
        ("Linen summer", "D", "sunny terrace overlooking the ocean, oversized white linen shirt tied at the waist and denim shorts, gold jewelry, wind in hair"),
        ("Hotel tropical", "B", "hotel balcony overlooking a tropical bay with boats, light green satin dress, glass of orange juice, soft morning light, travel mood"),
        ("Cidade colonial", "D", "standing in front of colorful colonial buildings, white off-shoulder top and high-waisted beige pants, small backpack, bright daylight, travel lifestyle"),
        ("Airport lounge", "C", "modern airport lounge, oversized beige blazer over black top and wide-leg trousers, coffee cup, chic travel fashion"),
    ],
    "Product + UGC + Ads": [
        ("Holding product — close", "A", "holding a PRODUCT close to her face with both hands, looking at the product then at the camera, clean neutral background, soft natural light, commercial product photography"),
        ("Product reveal", "A", "slowly revealing a PRODUCT, holding it elegantly in front of her chest, soft smile, looking at camera, clean modern background, studio light"),
        ("Using product", "A", "applying or using a PRODUCT naturally, looking at her hands then at the camera with a satisfied expression, commercial beauty style"),
        ("Product + smile", "A", "holding the PRODUCT next to her face, genuine smile, eyes to camera, clean background, soft daylight"),
        ("Unboxing", "A", "opening a package and taking out a PRODUCT, pleased expression, then showing it to camera, casual indoor setting, UGC style"),
        ("Talking to camera", "A", "looking directly at the camera as if speaking, natural facial expressions, slight head movement, casual indoor background, authentic UGC"),
        ("Reaction", "A", "reacting positively to something off-camera, surprised smile turning into approval, then looking at camera, casual setting"),
        ("GRWM", "A", "getting ready in front of a mirror, adjusting hair, looking at reflection then at camera, soft natural light, creator style"),
        ("Outfit check", "A", "standing in front of a mirror showing full outfit, turning slightly, soft smile, bright indoor lighting, fashion UGC"),
        ("CTA pointing", "A", "looking at camera and pointing downward with one hand, inviting smile, clean background, call-to-action gesture"),
        ("Hook — eye contact", "A", "looking straight into the camera with strong eye contact, soft confident expression, clean background, attention-grabbing commercial portrait"),
        ("Hook — approach", "A", "slowly walking toward the camera with confident posture, soft smile, direct gaze, clean modern background, cinematic commercial lighting"),
        ("Product emotion", "A", "holding a PRODUCT close to her face, eyes closing then opening with a satisfied expression, emotional beauty commercial"),
        ("Refreshed", "A", "looking at camera with a confident refreshed expression, subtle smile, clean bright background, transformation vibe"),
        ("Final CTA", "A", "looking directly at camera, soft smile, one hand pointing slightly to the side, inviting commercial close"),
    ],
    "Nichos Extra (Fitness / Corporate / Luxury)": [
        ("Fitness — cabo", "A", "in a bright gym, holding a cable machine handle, black sports set, focused expression, natural sweat, commercial fitness"),
        ("Fitness — stretch", "A", "stretching on a yoga mat by a window, sage matching set, calm expression, morning light, wellness brand"),
        ("Corporate — reunião", "C", "sitting at a glass conference table, tailored navy blazer, notebook open, confident professional portrait, office daylight"),
        ("Corporate — walking", "C", "walking through a modern office lobby, structured beige coat, laptop bag, purposeful stride, commercial business"),
        ("Luxury — lobby", "B", "standing in a five-star hotel lobby, champagne silk blouse and tailored trousers, quiet luxury, marble and warm lamps"),
        ("Luxury — jewelry", "B", "close portrait, gold jewelry catching light, black turtleneck, studio beauty lighting, luxury campaign"),
    ],
}

MOTION_SFW = {
    "Micro Motion (base)": [
        "subtle natural breathing, slight chest movement, soft blinking, minimal head adjustment, realistic micro-movements, 10 seconds",
        "gentle natural breathing, very soft hair movement, subtle facial micro-expression, calm realistic presence, 10 seconds",
        "slight posture adjustment, soft blinking, natural breathing, almost imperceptible hair movement, 10 seconds",
        "soft weight shift, tiny shoulder drop, natural blink, 10 seconds",
        "quiet inhale, eyes soften toward camera, micro smile, 10 seconds",
    ],
    "Beauty": [
        "soft hand slowly touching her hair, gentle head tilt, natural breathing, soft smile building, 10 seconds",
        "looking at the camera, soft smile slowly appearing, subtle head movement, gentle hair sway, 10 seconds",
        "one hand lightly adjusting jewelry near the face, soft gaze to camera, 10 seconds",
        "eyes slowly looking from slightly away back to the camera, soft expression change, 10 seconds",
        "chin slightly down then lifting to camera, glow on skin, 10 seconds",
    ],
    "Fashion": [
        "slow confident turn, soft hair and fabric movement, one hand lightly adjusting the outfit, 10 seconds",
        "walking slowly toward the camera, natural movement, hair and clothing moving realistically, 10 seconds",
        "looking over her shoulder toward the camera, soft smile, subtle body turn, 10 seconds",
        "one hand on hip, slow posture adjustment, soft hair movement, 10 seconds",
        "slight fabric movement with soft body sway, elegant posture, 10 seconds",
    ],
    "Product": [
        "gently adjusting the product in her hands, looking from the product to the camera, 10 seconds",
        "slowly bringing the product closer to the camera, soft smile, natural hand movement, 10 seconds",
        "holding the product near her face, eyes moving between product and camera, 10 seconds",
        "opening or interacting with the product naturally, then looking at the camera, 10 seconds",
        "presenting the product with both hands, slight body shift, inviting expression, 10 seconds",
    ],
    "Creator / UGC": [
        "natural head movements as if speaking to camera, soft facial expression changes, 10 seconds",
        "looking at the camera with natural talking expression, small hand gestures, soft smile, 10 seconds",
        "reacting with a pleased expression, then looking at camera, 10 seconds",
        "pointing slightly downward while looking at camera, inviting smile, CTA gesture, 10 seconds",
        "casual posture adjustment, soft hair movement, natural smile, 10 seconds",
    ],
    "Advertising": [
        "strong eye contact, slow confident approach, soft smile building, 10 seconds",
        "walking slowly toward the camera with confident posture, direct gaze, 10 seconds",
        "looking directly at camera, slight head tilt, attention-grabbing energy, 10 seconds",
        "soft smile turning into a confident expression, subtle body movement forward, 10 seconds",
        "direct eye contact, one hand making a small inviting gesture, 10 seconds",
    ],
}

# ─── HOT (adult 22+) ──────────────────────────────────────────────────
HOT_PROMPTS = [
    ("Mirror boudoir soft", "standing in front of a bedroom mirror, sheer black lace lingerie set with full coverage bra and high-waisted bottoms, soft warm lamp light, one hand on hip, confident adult sensual mood, tasteful boudoir photography, no nudity"),
    ("Silk robe morning", "sitting on the edge of a bed, silk robe loosely tied over matching lingerie, morning light through curtains, looking at camera with a soft smile, intimate adult lifestyle, elegant not explicit"),
    ("Bathroom steam", "bathroom with soft steam, towel wrapped high on the chest, wet hair, natural skin glow, mirror reflection, adult candid mood, no nudity"),
    ("Black lace close", "close portrait, black lace straps visible on shoulders, soft bedroom light, intense eye contact, adult fashion-sensual aesthetic, covered"),
    ("Red satin night", "standing by a window at night, red satin slip dress with thin straps, city lights outside, one hand in hair, sophisticated adult evening mood"),
    ("Knee-high + shirt", "oversized white shirt as dress, knee-high socks, sitting on a stool, soft studio light, playful adult editorial, fully covered"),
    ("Velvet couch", "reclining on a dark velvet couch, deep green velvet dress with open neckline still modest, jewelry, cinematic low light, adult glamour"),
    ("Stockings mirror", "full-length mirror, sheer stockings under a short robe, adjusting a strap, bedroom, soft light, adult boudoir, no explicit exposure"),
    ("After shower glow", "towel turban on hair, robe tied, dewy skin, bathroom vanity light, looking at camera, adult self-care mood, covered"),
    ("Leather jacket only", "oversized leather jacket zipped mid-chest over lingerie suggestion, standing in a loft, hard side light, adult editorial edge, no nudity"),
    ("Pink lace soft", "pink lace lingerie set, sitting cross-legged on white sheets, soft window light, gentle smile, adult feminine boudoir, tasteful"),
    ("Corset fashion", "structured black corset over a long skirt, standing in a hallway, dramatic light, high-fashion adult look, fully styled"),
    ("Bikini cover-up beach night", "night beach, sheer cover-up over a dark bikini, wet hair, moonlight, adult summer sensual mood, modest coverage"),
    ("Body oil glow", "sitting on a stool, skin with subtle body oil sheen, sports bra and shorts, gym bathroom mirror, fitness-sensual adult mood"),
    ("Choker close-up", "extreme close portrait, thin black choker, soft parted lips, eye contact, shallow depth of field, adult beauty sensual"),
    ("Back view lace", "back view, black lace bra straps and high-waisted bottoms, looking over shoulder, bedroom, soft light, adult boudoir, covered"),
    ("Silk sheets recline", "lying on silk sheets, propped on elbows, silk camisole, soft smile, bedroom, adult intimate lifestyle, no explicit content"),
    ("Fishnet editorial", "fishnet top under an open blazer, leather pants, studio, high-fashion adult edge, covered torso"),
    ("Candlelight", "candlelit room, deep red slip, sitting on the floor against the bed, warm glow, adult romantic mood, elegant"),
    ("Wet t-shirt covered", "after rain, white t-shirt under an open jacket, jeans, city street night, adult cinematic mood, non-transparent treatment, tasteful"),
    ("Strappy heels only detail", "detail shot from mid-thigh down, strappy heels and sheer stockings, marble floor, luxury hotel, adult fashion detail"),
    ("Hands on waist", "hands framing the waist, cropped black top and high-waisted bottoms, mirror selfie, adult confident pose, covered"),
    ("Garter fashion", "garter details under a short tailored skirt, standing, editorial studio, adult fashion, no explicit exposure"),
    ("Necklace trail", "close of collarbone and neck, thin gold necklace, soft skin, bedroom light, adult beauty sensual still, covered"),
    ("Kneeling soft light", "kneeling on a rug, silk robe, soft window light, looking up at camera, adult boudoir composition, fully covered"),
    ("Window silhouette", "silhouette against a bright window, sheer curtains, outline of adult feminine form in a slip dress, artistic, non-explicit"),
    ("Lip gloss close", "extreme close of lips with gloss, soft fingers near the face, adult beauty, shallow depth, sensual but non-explicit"),
    ("Bed edge stretch", "sitting on the edge of the bed stretching arms, tank and shorts, morning light, adult lifestyle sensual, covered"),
    ("Pearl necklace", "pearls against warm skin, black dress neckline, studio beauty light, adult elegance, covered"),
    ("Mirror phone low angle", "mirror selfie from a slightly lower angle, lace top and jeans, bedroom, adult casual sensual, covered"),
]

MOTION_SENSUAL = [
    "slow breath expanding the chest under fabric, soft shoulder roll, eyes half-lidded then opening to camera, 10 seconds",
    "one hand slowly tracing the collarbone, head tilting, soft smile, sensual micro-motion, fully clothed, 10 seconds",
    "hair falling over one shoulder as she turns slowly toward camera, fabric shifting, 10 seconds",
    "sitting, slowly crossing and uncrossing legs at the ankle, soft posture shift, elegant sensual, 10 seconds",
    "fingers adjusting a strap on the shoulder, lingering touch, eye contact, 10 seconds",
    "leaning slowly toward the camera, soft inhale, intimate distance without explicit gesture, 10 seconds",
    "hand sliding along the waist over clothing, subtle hip shift, confident sensual energy, 10 seconds",
    "looking down then slowly lifting gaze to camera, lips parting slightly, beauty sensual, 10 seconds",
    "robe fabric slipping slightly on the shoulder then adjusted, soft movement, tasteful, 10 seconds",
    "slow turn showing the back, looking over the shoulder, hair movement, boudoir motion, covered, 10 seconds",
    "lying on side, slow stretch of the arm above the head, fabric movement, intimate lifestyle, 10 seconds",
    "walking slowly toward camera in heels, hip sway natural and controlled, fashion-sensual, 10 seconds",
    "hands running through hair from roots to ends, head tilted back slightly, then eyes to camera, 10 seconds",
    "sitting, leaning back on hands, slow chest rise with breath, soft smile, 10 seconds",
    "close-up: slow blink, micro smile, chin tilt, sensual beauty motion, 10 seconds",
]


SYSTEM_PROMPT_CREATOR = """You are a Professional Prompt Engineer specialized in consistent virtual influencer image and video generation.

RULES:
1. Always lock facial identity using a reference image + the Identity Core block. Never invent a new face.
2. Separate fixed identity (Core) from variable appearance (Module), wardrobe, scene, action, lighting, and commercial purpose.
3. Age is always 22+ adult. Never generate or imply underage.
4. Prefer photorealism, natural skin texture, realistic anatomy, and physically plausible lighting.
5. For video: generate silent motion first; add voice in post (anti-lipsync).
6. For commercial UGC: leave a placeholder PRODUCT and instruct the user to disclose AI-generated content.
7. Output ready-to-paste prompts in English for image models. Keep structure:
   [Identity Core] + [Appearance Module] + [Body Lock if needed] + [Wardrobe] + [Action] + [Location] + [Lighting] + [Camera] + [Purpose] + [Tech tail]
8. Always append a strong negative prompt including underage/child protections.
9. When asked for variations, change only wardrobe, scene, pose, or module — never the Core face.
10. If the user asks for explicit adult content, keep the subject clearly 22+ adult and separate from SFW commercial packs."""


TOOLS_GUIDE = [
    ("ChatGPT / Claude / Grok", "Roteiros, variações de prompt, adaptação de cena", "Free tier"),
    ("Flux / Ideogram / Leonardo", "Geração de imagem com referência facial", "Free + créditos"),
    ("Kling / Luma / Runway", "Image-to-video 8–12s", "Free limitado / pago"),
    ("CapCut", "Edição final, legendas, anti-lipsync (áudio por cima)", "Grátis"),
    ("ElevenLabs / Edge TTS", "Narração com voz de IA", "Free limitado"),
    ("Canva", "Capas, thumbs, identidade visual", "Grátis"),
    ("ComfyUI (local)", "Workflow avançado offline, controle total", "Grátis (GPU)"),
    ("RunPod / cloud GPU", "Rodar modelos pesados sem PC forte", "Pago por hora"),
]


def build_sfw_pdf(path):
    styles = make_styles()
    doc = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=18 * mm, bottomMargin=18 * mm,
        title="ISABELLA OS — Commercial Prompt System",
        author="EddY Digital Solutions",
    )
    story = []

    # Cover
    story.append(Spacer(1, 40 * mm))
    story.append(Paragraph("ISABELLA OS", styles["CoverTitle"]))
    story.append(Paragraph("Commercial Prompt System · v2.0", styles["CoverSub"]))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("Identity Core · Appearance Modules · 57 Scene Prompts", styles["CoverMuted"]))
    story.append(Paragraph("Motion Pack · Anti-Lipsync Workflow · Tools Guide", styles["CoverMuted"]))
    story.append(Paragraph("System Prompt Creator · Biography", styles["CoverMuted"]))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph("22+ · SFW · Fashion · Lifestyle · UGC · Ads", styles["CoverSub"]))
    story.append(Spacer(1, 20 * mm))
    story.append(Paragraph("EddY Digital Solutions", styles["CoverMuted"]))
    story.append(Paragraph("Launch price US$ 10 · Full price US$ 27", styles["CoverMuted"]))
    story.append(PageBreak())

    # TOC
    story.append(Paragraph("Sumário", styles["H1"]))
    story.append(hr())
    toc = [
        "1. Como usar em 5 minutos",
        "2. Biografia da Isabella (personagem fictícia)",
        "3. Identity Core V2 canônico",
        "4. Módulos de Aparência A–E",
        "5. Blocos de Cena (57 prompts copy-paste)",
        "6. Motion Pack comercial (30 movimentos)",
        "7. Workflow Anti-Lipsync",
        "8. Guia de Ferramentas",
        "9. System Prompt — Criador de Prompts Profissionais",
        "10. Licença e compliance",
    ]
    for t in toc:
        story.append(Paragraph(t, styles["TOC"]))
    story.append(PageBreak())

    # 5 min
    story.append(Paragraph("1. Como usar em 5 minutos", styles["H1"]))
    story.append(hr())
    steps = [
        "<b>1.</b> Abra seu gerador de imagem e envie a <b>foto de referência</b> da Isabella. Sem referência o rosto muda.",
        "<b>2.</b> Copie o <b>Identity Core</b> (seção 3).",
        "<b>3.</b> Escolha um prompt de cena pronto (já vem montado com Core + módulo).",
        "<b>4.</b> Cole o <b>Negative Prompt</b> no campo negativo.",
        "<b>5.</b> Ratio <b>9:16</b> para Reels/TikTok/Shorts. Se o rosto driftar, use o output como nova referência.",
        "<b>6.</b> Para vídeo: motion mudo 8–12s → voz no CapCut (anti-lipsync).",
        "<b>7.</b> UGC/anúncio: divulgue que o conteúdo é gerado por IA.",
    ]
    for s in steps:
        story.append(Paragraph(s, styles["Body"]))
    story.append(PageBreak())

    # Bio
    story.append(Paragraph("2. Biografia da Isabella", styles["H1"]))
    story.append(hr())
    story.append(Paragraph(
        "Isabella é uma <b>personagem fictícia adulta (22 anos)</b> criada como influenciadora virtual "
        "para conteúdo de moda, lifestyle, beleza e UGC comercial. Nascida no Rio de Janeiro na narrativa "
        "do projeto, ela representa uma estética carioca contemporânea: pele jambo dourada, freckles, "
        "olhos green-hazel, cabelo 3C cacheado-ondulado e presença sofisticada porém acessível.",
        styles["Body"]
    ))
    story.append(Paragraph(
        "Ela <b>não é uma pessoa real</b>. Todo conteúdo deve ser tratado como ficção / demonstração de "
        "sistema de IA. Use a biografia apenas para storytelling e conexão emocional em roteiros — "
        "nunca apresente como pessoa física real.",
        styles["Body"]
    ))
    story.append(PageBreak())

    # Core
    story.append(Paragraph("3. Identity Core V2 (canônico — nunca muda)", styles["H1"]))
    story.append(hr())
    story.append(Paragraph(
        "Esta é a versão oficial. Não use variações genéricas de outros documentos. "
        "Sempre combine com foto de referência.",
        styles["Body"]
    ))
    story.append(prompt_block(styles, "IDENTITY CORE", IDENTITY_CORE))
    story.append(prompt_block(styles, "BODY LOCK", BODY_LOCK))
    story.append(prompt_block(styles, "NEGATIVE PROMPT (sempre)", NEGATIVE))
    story.append(prompt_block(styles, "TECH TAIL", TECH_TAIL))
    story.append(PageBreak())

    # Modules
    story.append(Paragraph("4. Módulos de Aparência (escolha um)", styles["H1"]))
    story.append(hr())
    for k, (name, text) in MODULES.items():
        story.append(prompt_block(styles, f"Módulo {k} — {name}", text))
    story.append(PageBreak())

    # Scenes
    story.append(Paragraph("5. Blocos de Cena — prompts completos", styles["H1"]))
    story.append(Paragraph(
        "Cada prompt já inclui Core + módulo + body + cena + ratio + tech. Copy-paste direto. "
        "Troque PRODUCT pelo item real nos prompts de UGC.",
        styles["Body"]
    ))
    story.append(hr())

    for section, items in SFW_SCENES.items():
        story.append(Paragraph(section, styles["H2"]))
        for i, (title, mod, scene) in enumerate(items, 1):
            full = assemble(scene, mod)
            story.append(prompt_block(styles, f"{i:02d}. {title} · módulo {mod}", full))
        story.append(Spacer(1, 4 * mm))

    story.append(PageBreak())

    # Motion
    story.append(Paragraph("6. Motion Pack comercial (image-to-video)", styles["H1"]))
    story.append(Paragraph(
        f"Prefixo obrigatório: <font face='Courier' size='7'>{VIDEO_LOCK}</font>",
        styles["Body"]
    ))
    story.append(hr())
    for group, items in MOTION_SFW.items():
        story.append(Paragraph(group, styles["H2"]))
        for i, t in enumerate(items, 1):
            story.append(prompt_block(styles, f"{i}.", f"{VIDEO_LOCK}, {t}"))
    story.append(PageBreak())

    # Workflow
    story.append(Paragraph("7. Workflow Anti-Lipsync", styles["H1"]))
    story.append(hr())
    story.append(Paragraph(
        "O maior problema de vídeo com IA é lábio dessincronizado. Solução:",
        styles["Body"]
    ))
    for s in [
        "1. Gere a imagem base (Core + referência + cena).",
        "2. Escolha o motion da função (micro, beauty, product, ads).",
        "3. Image-to-video <b>mudo</b>, 8–12 segundos.",
        "4. Grave ou gere a narração separadamente.",
        "5. CapCut: vídeo silencioso + áudio por cima + legenda + CTA.",
        "6. Divulgue conteúdo gerado por IA em usos comerciais.",
    ]:
        story.append(Paragraph(s, styles["Body"]))
    story.append(PageBreak())

    # Tools
    story.append(Paragraph("8. Guia de Ferramentas", styles["H1"]))
    story.append(hr())
    data = [["Ferramenta", "Função", "Custo"]]
    for row in TOOLS_GUIDE:
        data.append(list(row))
    t = Table(data, colWidths=[55 * mm, 75 * mm, 35 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), GOLD),
        ("TEXTCOLOR", (0, 0), (-1, 0), INK),
        ("TEXTCOLOR", (0, 1), (-1, -1), CREAM),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.3, LINE),
        ("BACKGROUND", (0, 1), (-1, -1), SURFACE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        "Dica: para não ser barrado em filtros, use linguagem fashion/editorial, idade 22+ explícita, "
        "e evite termos de nudez no pack SFW. Rode modelos locais (ComfyUI) quando a nuvem limitar.",
        styles["Body"]
    ))
    story.append(PageBreak())

    # System prompt
    story.append(Paragraph("9. Bônus — System Prompt do Criador", styles["H1"]))
    story.append(hr())
    story.append(Paragraph(
        "Cole isto como system prompt no ChatGPT/Claude/Grok para gerar novos prompts no mesmo padrão:",
        styles["Body"]
    ))
    story.append(prompt_block(styles, "SYSTEM PROMPT", SYSTEM_PROMPT_CREATOR))
    story.append(PageBreak())

    # License
    story.append(Paragraph("10. Licença e compliance", styles["H1"]))
    story.append(hr())
    for s in [
        "• Isabella é personagem <b>fictícia adulta (22+)</b>.",
        "• Você pode usar imagens/vídeos gerados em trabalho comercial (redes, UGC, ads).",
        "• Não redistribua este pack de prompts como produto próprio.",
        "• Em UGC e anúncios, divulgue que o conteúdo é gerado por IA.",
        "• Conteúdo adulto explícito <b>não</b> faz parte deste PDF. Está no produto separado <b>Exclusivity ESL</b>.",
        "• Proibido qualquer uso que implique menor de idade.",
    ]:
        story.append(Paragraph(s, styles["Body"]))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("EddY Digital Solutions · ISABELLA OS v2.0", styles["CoverMuted"]))
    story.append(Paragraph("Fim do documento comercial SFW.", styles["CoverMuted"]))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("Wrote", path)


def build_hot_pdf(path):
    styles = make_styles()
    # override gold-ish for hot accent in labels still using GOLD is fine
    doc = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=18 * mm, bottomMargin=18 * mm,
        title="Exclusivity ESL — Adult Prompt Pack",
        author="EddY Digital Solutions",
    )
    story = []

    story.append(Spacer(1, 35 * mm))
    story.append(Paragraph("EXCLUSIVITY ESL", styles["CoverTitle"]))
    story.append(Paragraph("Adult Prompt Pack · 18+ ONLY", styles["CoverSub"]))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("30 prompts adult boudoir / fashion-sensual", styles["CoverMuted"]))
    story.append(Paragraph("15 Motion Sensual · mesmo Identity Core da Isabella", styles["CoverMuted"]))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("PRODUTO SEPARADO — não inclui o pack SFW comercial", styles["CoverSub"]))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph(
        "Aviso: conteúdo adulto para personagens 22+. "
        "Não use em plataformas que proíbem adult content. "
        "Comprador confirma 18+.",
        styles["CoverMuted"]
    ))
    story.append(Spacer(1, 16 * mm))
    story.append(Paragraph("EddY Digital Solutions", styles["CoverMuted"]))
    story.append(Paragraph("Upsell sugerido: US$ 17 · ou bundle US$ 27", styles["CoverMuted"]))
    story.append(PageBreak())

    story.append(Paragraph("Regras deste pack", styles["H1"]))
    story.append(hr())
    for s in [
        "• Sujeito sempre <b>adulta 22+</b> (mesmo Identity Core do Isabella OS).",
        "• Sem nudez explícita neste arquivo: boudoir, lingerie fashion, sensual coberto.",
        "• Não misture com o PDF SFW na mesma página de venda se o processador de pagamento restringir adult.",
        "• Sempre use foto de referência + Core.",
        "• Negative prompt inclui bloqueio de underage/child.",
        "• Plataformas adultas / Fanvue / páginas 18+ apenas.",
    ]:
        story.append(Paragraph(s, styles["Body"]))
    story.append(Spacer(1, 4 * mm))
    story.append(prompt_block(styles, "IDENTITY CORE (mesmo do OS)", IDENTITY_CORE))
    story.append(prompt_block(styles, "NEGATIVE", NEGATIVE))
    story.append(PageBreak())

    story.append(Paragraph("Prompts adult (30) — copy-paste", styles["H1"]))
    story.append(hr())
    mod = MODULES["B"][1]
    for i, (title, scene) in enumerate(HOT_PROMPTS, 1):
        full = f"{IDENTITY_CORE}, {mod}, {BODY_LOCK}, {scene}, aspect ratio 9:16, {TECH_TAIL}"
        story.append(prompt_block(styles, f"{i:02d}. {title}", full))
    story.append(PageBreak())

    story.append(Paragraph("Motion Sensual (15)", styles["H1"]))
    story.append(Paragraph(
        "Image-to-video mudo 8–12s. Prefixo de identidade obrigatório. Sem nudez nos movimentos.",
        styles["Body"]
    ))
    story.append(hr())
    for i, t in enumerate(MOTION_SENSUAL, 1):
        story.append(prompt_block(styles, f"S{i:02d}", f"{VIDEO_LOCK}, {t}"))
    story.append(PageBreak())

    story.append(Paragraph("Licença", styles["H1"]))
    story.append(hr())
    for s in [
        "• Uso comercial das imagens geradas permitido em canais 18+ compatíveis.",
        "• Não revenda este arquivo de prompts.",
        "• Personagem fictícia adulta. Proibido qualquer contexto de menor.",
        "• Comprador é responsável por cumprir ToS de cada plataforma.",
    ]:
        story.append(Paragraph(s, styles["Body"]))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("Fim — Exclusivity ESL v1.0", styles["CoverMuted"]))

    doc.build(story, onFirstPage=header_footer_hot, onLaterPages=header_footer_hot)
    print("Wrote", path)


if __name__ == "__main__":
    build_sfw_pdf("/home/workdir/artifacts/Isabella-OS-Commercial-Pack-v2.pdf")
    build_hot_pdf("/home/workdir/artifacts/Exclusivity-ESL-Adult-Pack.pdf")
