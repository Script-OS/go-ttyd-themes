const styleDesc = `
body {
    background: black;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
#crt {
    position: relative;
    z-index: 1;
    overflow: hidden;
    background: #3f3933;
    padding: 5.5vmin;
    border-radius: 5px;
    box-shadow: 5px black;
}
#screen {
    position: relative;
    border: 30px solid transparent;
    border-image-source: url(/themes/bezel_gray.png);
    border-image-slice: 30 fill;
    border-image-outset: 0;
    overflow: hidden;
    height: calc(95vmin - 60px - 11vmin);

    max-width: calc(100vw - 60px - 11vmin) !important;
    max-height: calc(100vh - 60px - 11vmin) !important;
    aspect-ratio: 4 / 3;
}

#overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: radial-gradient( ellipse, #5bf870 0%, #050505 90% );
    pointer-events: none;
    opacity: 0.3;
}
#overlay::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient( to bottom, rgba(18, 16, 16, 0.1) 50%, rgba(0, 0, 0, 0.25) 50% );
    background-size: 100% 8px;
    pointer-events: none;
}
@keyframes scanline {
    0% {
        bottom: 100%;
    }
    80% {
        bottom: 100%;
    }
    100% {
        bottom: -20%;
    }
}
#scanline {
    width: 100%;
    height: 100px;
    z-index: 8;
    background: linear-gradient( 0deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.2) 10%, rgba(0, 0, 0, 0) 100% );
    opacity: 0.5;
    position: absolute;
    bottom: 50%;
    pointer-events: none;
    animation: scanline 10s linear infinite;
}

#terminal {
    z-index: 1;
    height: 100%;
}

.xterm-viewport {
    scrollbar-color: #101010 black;
}
.xterm-viewport::-webkit-scrollbar {
    width: auto;
}
.xterm-viewport::-webkit-scrollbar-track {
    background-color: black;
}
.xterm-viewport::-webkit-scrollbar-thumb {
    background-color: #101010;
}

css-doodle {
    position: absolute;
}

#led {
    position: absolute;
    left: calc(5.5vmin + 30px);
    bottom: 2.75vmin;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: white;
    box-shadow: -1.5px -1.5px 2px 4px red inset, 0 0 16px black, 0 0 8px 2px red;
    filter: blur(1px) brightness(0.7);
}
`;

// `10 PRINT` art
const background = `
@grid: 1 / 100vw 100vh;
background-size: 320px 320px;
background-image: @doodle(
    @grid: 16 / 320px;
    @size: 1px 100%;
    transform-origin: center;
    transform: rotate(@p(±45deg)) scale(1.414, 1.414);
    background: #AEACFB;
    margin: auto;
);
`;

const noisy = `
@grid: 1 / 100% 100%;
background-size: 100% 100%;
background: @shaders(
    fragment {
        void main() {
            vec2 p = gl_FragCoord.xy / u_resolution.xy;
            float rand = fract(sin(p.x)*100000.0) * fract(sin(p.y)*100000.0);
            float light = float(int(rand * 11.0) % 2);
            FragColor = vec4(light, light, light, .022);
        }
    }
);
`;

const htmlDesc = `
<div id="screen">
    <div id="overlay">
        <div id="scanline"></div>
    </div>
</div>
<div id="led"></div>
`;

export async function init(params) {
    const Style = document.createElement("style");
    Style.innerHTML = styleDesc;
    document.body.append(Style);

    await import("https://unpkg.com/css-doodle@0.28.2/css-doodle.min.js");
    const doodle = document.createElement('css-doodle');
    document.body.append(doodle);
    if (params.has('bg') && params.get('bg') == '10PRINT') {
        doodle.update(background);
    }

    const CRT = document.createElement("div");
    CRT.id = "crt";
    CRT.innerHTML = htmlDesc;
    document.body.append(CRT);
    document.getElementById("screen").insertBefore(document.getElementById("terminal"), document.getElementById("overlay"));

    const noiseDoodle = document.createElement('css-doodle');
    noiseDoodle.style.top = "0";
    noiseDoodle.style.left = "0";
    // noiseDoodle.style.width = "calc(100% + 11vmin)";
    // noiseDoodle.style.height = "calc(100% + 11vmin)";
    noiseDoodle.update(noisy);
    document.getElementById("crt").insertBefore(noiseDoodle, document.getElementById("screen"));
}
