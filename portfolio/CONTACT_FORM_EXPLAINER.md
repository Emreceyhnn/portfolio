# The Contact Form — Plain-Words Explainer

## What a "backend" is, in plain words

A backend is just: some code that runs on a computer other than the
visitor's, that's allowed to do things a browser tab isn't — like sending
an email, writing to a database, or holding a secret credential. When you
fill out a form and hit "submit," the browser can't email that data to
anyone by itself; it has to hand the data to *something else* that can.
That something else is the backend.

## What this site's feature does

The portfolio is a static React app — Vite builds it into plain HTML/CSS/JS
files and Vercel just serves those files. There's no server of mine
running anywhere; nothing in this project can send an email on its own.

So the "Get in Touch" form doesn't talk to a server I wrote. It talks to
**Web3Forms** (web3forms.com), a free hosted service whose entire job is:
"give me some JSON, I'll email it to whoever this key belongs to." Web3Forms
*is* the backend here — I didn't build it, I'm just using it, the same way
a site might use Stripe for payments instead of building its own payment
processor.

## How the data actually flows

1. You type your name, email, and message into the form on
   `emreceyhan.xyz` and click "Send message."
2. The browser (client-side JavaScript, in `ContactForm.tsx`) packages
   that into JSON and sends it directly over HTTPS to
   `https://api.web3forms.com/submit` — no stop at any server of mine in
   between.
3. Along with your data, the request includes an **access key** — a
   token that's tied to my email address on Web3Forms' side. That's how
   Web3Forms knows *whose inbox* to deliver the message to. Without the
   key, or with the wrong key, the message would go nowhere (or to
   someone else's inbox).
4. Web3Forms' own servers receive the request, check the key, and send
   an email to my inbox (emreceyhnn@gmail.com) with your name, email,
   and message in the body.
5. Web3Forms replies to the browser with a small JSON response —
   `{"success": true, ...}` — and the form reads that response to decide
   what to show you: a green "Message sent" confirmation, or a red error
   if something went wrong (network down, Web3Forms rejected it, etc.).
   That's the loading → success/error state you see in the UI.

## Why the access key being visible in the code isn't a security hole

The access key ships inside the JavaScript bundle, so anyone can view
it in the browser's dev tools. That's fine *for this specific use* —
Web3Forms designed the key to be public/client-side on purpose. The key
can only ever do one thing: send an email *to the inbox it's tied to*.
It can't read my inbox, can't send email *as* someone else, can't touch
a database. The worst a malicious actor could do with it is send me spam
— which is exactly what the honeypot field (see below) is there to cut
down on, and why Web3Forms rate-limits and flags abuse on their end.

## The one spam guard: a honeypot

There's a checkbox input named `botcheck` that's visually hidden (not
`display:none`, since some bots specifically skip fields hidden that
way — it's hidden via `opacity: 0` + 1x1px sizing instead) and never
gets tabbed to (`tabIndex={-1}`). A real visitor never sees or fills it
in. A bot that blindly fills every input on the page fills it in too —
and Web3Forms silently drops any submission where that field has a
value.

## What "genuinely works" looks like here

- Fill out the form on the live site with a real message.
- Web3Forms emails it to emreceyhnn@gmail.com within seconds.
- The page shows the green "Message sent" confirmation the moment
  Web3Forms' API responds with `success: true` — that confirmation is
  not faked or shown optimistically before the request completes; it
  only renders after a real 200 response comes back.
