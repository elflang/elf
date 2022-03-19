#!/usr/bin/env elf

(var ffi (require 'ffi))
(var sdl (require 'ffi/sdl))
(var wm (require 'lib/wm/sdl))
(var uint32ptr ffi.typeof('uint32_t*))

|
local modf,fmod,pi, cos, sin, abs, sqrt, band, bor, bxor, shl, shr, rol, ror, random, floor, ceil = 
math.modf,math.fmod, math.pi, math.cos, math.sin, math.abs, math.sqrt, bit.band, bit.bor, bit.bxor, bit.lshift, bit.rshift, bit.rol, bit.ror, math.random, math.floor, math.ceil
|

(var level ffi.new("uint8_t[?]" {64 * 64 * 64}))
(var texmap ffi.new("uint32_t[?]" {16 * 16 * 16 * 3}))
(var mod (x y) (fmod x y))
(var rand (x) {math.random(x) - 1})

(var init ()
  (for i 16
    (var br {255 - rand(96)})
    (for y {16 * 3}
      (for x 16
        (var color 0x966C4A)
        (if {i is 3}
            {color = 0x7F7F7F})
        (if {{i ~is 3} or {rand(3) is 0}}
            {br = {255 - rand(96)}})
        (if {{i is 0} and {y < {band(shr({x * x * 3 + {x * 81}} 2) 3) + 18}}}
            {color = 0x6AAA40}
            {{i is 0} and {y < {band(shr({x * x * 3 + {x * 81}} 2) 3) + 19}}}
            {br = {br * 2 / 3}})
        (when {i is 6}
          {color = 0x675231}
          (if {{x > 0} and {x < 15} and {{{y > 0} and {y < 15}} or {{y > 32} and {y < 47}}}}
              (do {color = 0xBC9862}
                  (var xd {x - 7})
                  (var yd {band(y 15) - 7})
                  (if {xd < 0} {xd = {1 - xd}})
                  (if {yd < 0} {yd = {1 - yd}})
                  (if {yd > xd} {xd = yd})
                  {br = {196 - rand(32) + {mod(xd 3) * 32}}})
              {rand(2) is 0}
              {br = {br * {{150 - {band(x 1) * 100}} / 100}}}))
        (when {i is 4}
          {color = 0xB53A15}
          (if {{mod({x + {shr(y 2) * 4}} 8) is 0} or {mod(y 4) is 0}}
              {color = 0xBCAFA5}))
        (when {i is 8}
          {color = 0x4040FF})
        (var brr br)
        (if {y >= 32} {brr = {brr / 2}})
        (when {i is 7}
          {color = 0x50D937}
          (when {rand(2) is 0}
            {color = 0}
            {brr = 255}))
        {{texmap at {x + {y * 16} + {i * 256 * 3} - 1}} =
         bor(shl({band(shr(color 16) 255) * brr / 255} 16) 
             shl({band(shr(color 8) 255) * brr / 255} 8)
             {band(color 255) * brr / 255})})))
  (for x 64
    (for y 64
      (for z 64
        (var i bor(shl(z 12) shl(y 6) x))
        (var yd {{y - 32.5} * 0.4})
        (var zd {{z - 32.5} * 0.4})
        {level at i = rand(16)}
        (if {random() > {sqrt(sqrt({yd * yd + {zd * zd}})) - 0.8}}
            {level at i = 0})))))

(during-compilation
  (mac vars (names values rest: more)
    (if (some? more) `(do (vars ,names ,values) ,(xform (pair more) `(vars ,@_)))
        (atom? names) `(vars (,names) (,values))
        (none? names) nil
      (let ((x rest: ys) names
            (a rest: bs) values)
          (if (atom? x)
              `(do (var ,x ,a) (vars ,ys ,bs))
            `(do ,(xform x `(var ,_)) (= ,x ,a) (vars ,ys ,bs)))))))


(var renderMinecraft (screen time)
  (vars pixels      ffi.cast(uint32ptr screen.pixels)
        (w h pitch) (screen.w screen.h {screen.pitch / 4})
        xRot        {sin({mod(time 10000) / 10000 * pi * 2}) * 0.4 + {pi / 2}}
        yRot        {cos({mod(time 10000) / 10000 * pi * 2}) * 0.4}
        (yCos ySin) (cos(yRot) sin(yRot))
        (xCos xSin) (cos(xRot) sin(xRot))
        (ox oy oz)  ({32.5 + {mod(time 10000) / 10000 * 64}} 32 32))

  (for x w
    (var ___xd {{x - {w / 2}} / h})
    (for y h
      (var  __yd {{y - {h / 2}} / h})
      (var  __zd 1)
      (var ___zd {{__zd * yCos} + {__yd * ySin}})
      (var   _yd {{__yd * yCos} - {__zd * ySin}})
      (var   _xd {{___xd * xCos} + {___zd * xSin}})
      (var   _zd {{___zd * xCos} - {___xd * xSin}})
      (vars (col br ddist closest) (0 255 0 32))
      (for d 3
        (var dimLength _xd)
        (if {d is 1} {dimLength = _yd})
        (if {d is 2} {dimLength = _zd})

        (var ll {1 / abs(dimLength)})
        (var xd {_xd * ll})
        (var yd {_yd * ll})
        (var zd {_zd * ll})

        (var initial {ox % 1})
        (if {d is 1} {initial = {oy % 1}})
        (if {d is 2} {initial = {oz % 1}})
        (if {dimLength > 0} {initial = {1 - initial}})

        (var dist {ll * initial})

        (var xp {ox + {xd * initial}})
        (var yp {oy + {yd * initial}})
        (var zp {oz + {zd * initial}})

        (when {dimLength < 0}
          (case d
            0 (-- xp)
            1 (-- yp)
            2 (-- zp)))

        (while {dist < closest}
          (vars (xp1 yp1 zp1) (modf(xp) modf(yp) modf(zp)))
          (var tex {level at {bor(shl(band(zp1 63) 12) shl(band(yp1 63) 6) band(xp1 63)) - 1}})
          (when {tex > 0}
            (var u band({{xp + zp} * 16} 15))
            (var v {band({yp * 16} 15) + 16})
            (when {d is 1}
              {u = band({xp * 16} 15)}
              {v = band({zp * 16} 15)}
              (if {yd < 0}
                (++ v 32)))

            (var cc {texmap at {u + {v * 16} + {tex * 256 * 3} - 1}})
            (when {cc > 0}
              {col = cc}
              {ddist = {255 - modf({dist / 32 * 255})}}
              {br = {255 - {{{d + 2} % 3} * 50}}}
              {closest = dist}))

          (++ xp xd)
          (++ yp yd)
          (++ zp zd)
          (++ dist ll)))

      {{pixels at {x + {y * pitch} - 1}} =
       bor(
         shl({band(shr(col 16) 0xff) * br * ddist / {255 * 255}} 16) 
         shl({band(shr(col  8) 0xff) * br * ddist / {255 * 255}}  8)
         {band(col 255) * br * ddist / {255 * 255}})})))

(var main ()
  init()
  (vars
    (prev-time curr-time fps) (nil 0 0)
    (ticks-base ticks) (0 0)
    (bounce-mode bounce-range) (false 1024)
    (bounce-delta bounce-step) (0 1))
  {wm.width = {212 * 2}}
  {wm.height = {120 * 2}}
  (while wm.update(wm)
    (var event wm.event)
    (vars (sym mod) (event.key.keysym.sym event.key.keysym.mod))
    (case wm.kb
      13 sdl.SDL_WM_ToggleFullScreen(wm.window)
      27 (do wm.exit(wm)
             (break))
      code(" ") (do {bounce-mode = (not bounce-mode)}
                    (++ ticks-base ticks))
      code("o") (-- ticks-base 100)
      code("p") (++ ticks-base 100))
    (if {ticks-base > {256 * 256 * 256}}
        {ticks-base = 0})
    (when bounce-mode
      (when {abs(bounce-delta) > bounce-range}
        {bounce-step = (- bounce-step)})
      (++ bounce-delta bounce-step)
      {ticks = {ticks-base + bounce-delta}})
    (unless bounce-mode
      {ticks = sdl.SDL_GetTicks()})
    ;; render the screen and flip it
    renderMinecraft(wm.window {ticks + ticks_base})
    ;; calculate the frame rate
    {prev-time = curr-time}
    {curr-time = os.clock()}
    (var diff {curr-time - prev-time + 0.00001})
    (var real-fps {1 / diff})
    (if {{abs({fps - real-fps}) * 10} > real-fps}
        {fps = real-fps})
    {fps = {{fps * 0.99} + {0.01 * real-fps}}}
    ;; update the window caption with statistics
    sdl.SDL_WM_SetCaption(
      string.format("%d %s %dx%d , %.2f fps , %.2f mps"
       ticks_base tostring(bounce-mode) wm.window.w wm.window.h fps
       {fps * {wm.window.w * wm.window.h} / {1024 * 1024}})
      nil))
  sdl.SDL_Quit())

main()

