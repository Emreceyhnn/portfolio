# Retrospective — FlyRank AI Internship

*Written for the person I was in Week 1.*

When I started this internship, my plan was to build CollabPro as a full
real-time collaboration platform — documents, boards, tasks, auth, the
whole SaaS surface — and to treat the portfolio site as a static resume
with a nice 3D background bolted on. Eight weeks later, neither of those
is quite what shipped, and both are better for it.

**What I set out to do.** CollabPro was scoped ambitiously: a
multi-tenant workspace with real-time documents and task boards. The
portfolio was scoped as "make it look impressive" — a hero animation,
a project grid, a contact form, done.

**What changed.** The collaboration platform never got built past shell
pages, and I stopped pretending it would. Around FE-05 through FE-09, the
one feature with a genuinely scoped, testable AI capability — the chat
assistant with a real link-preview tool — kept getting more attention
than the placeholder dashboard/documents/settings screens, and by the
capstone week I made that explicit instead of faking three more
half-built pages with static mock data to look "done." The README says
this directly: "the honest state at capstone time is that only the AI
assistant is real." That sentence was harder to write than any code in
this internship. It would have been easy to add fake data to the
dashboard and let a skim-level review pass. It wouldn't have passed the
internship's own "Break Your Own Site" honesty theme, and it wouldn't
have been true.

The portfolio went a different direction — from "looks impressive" to
"survives contact with a real user." The FE-10 audit found the 3D
background was costing 38 seconds of Total Blocking Time on throttled
mobile and the sidebar nav was showing four broken placeholder links with
zero visual distinction from the two that worked. Neither of those was
visible from the code; both were only visible from opening the site the
way a first-time visitor actually would. Fixing them — a quality-tiered
Three.js scene, later replaced with an even lighter hand-written GLSL
shader for FE-AA3, and a sidebar that labels unbuilt pages "Soon" — did
more for the site's honesty and usability than any feature I added.

**What I'd build next.** DocuMind — a .NET microservice RAG document
assistant — is already in progress outside this program: Auth.Service and
Document.Service are done, RAG.Service (Ollama-backed local LLM) is next.
It's a deliberately different stack (.NET instead of Next.js end-to-end)
because I wanted the next case study to prove range, not repeat CollabPro
with different colors.

**The three most transferable things I learned:**

1. **Scope honestly stated beats scope silently padded.** A README that
   says "here's what's real and here's what's roadmap" is more credible
   to a reviewer than one that implies everything works. This showed up
   twice — CollabPro's capstone scope and the portfolio's sidebar — and
   both times the honest version was also the better product decision,
   not just the more ethical one.
2. **Run the actual audit, don't assume the audit.** The accessibility
   pass that found the sidebar confusion took five minutes and found a
   problem I'd been shipping past for weeks. Lighthouse scores,
   cross-browser passes, and manual contrast checks aren't checkboxes —
   they're the only way some classes of bug become visible at all,
   because they're invisible from reading the code.
3. **AI is a fast first-draft partner, not a decision-maker.** Every
   AI-assisted piece of this internship — the rate limiter, the streaming
   error-handling shape, the shader math — got a first draft from an AI
   assistant and then a real review pass where I changed something,
   because I was the one who had to explain it on camera or in a README.
   The work that stuck was the work I could defend line by line, not
   the work that merely compiled.

If I did this again, I'd make the capstone-scope decision in Week 5
instead of Week 8 — I'd have spent less time on placeholder routing that
never needed to exist and more time on the rate limiter and tests that
should have shipped the day the assistant route went live with a real
API key, not bolted on at the end.
