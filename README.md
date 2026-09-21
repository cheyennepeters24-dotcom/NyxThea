# Nyxthea

> **The Intelligence That Runs Your World.**

Nyxthea is a Cloudflare Worker foundation for a personal intelligence layer—not a storefront or a single-purpose chatbot. It establishes honest conversation, public research, user-controlled memory, privacy boundaries, and a capability registry that distinguishes what works today from the architecture planned for later.

## Available now

- Text conversation through Cloudflare Workers AI using `@cf/google/gemma-4-26b-a4b-it` when the `AI` binding is configured.
- Public research using Wikimedia/Wikipedia, with only returned Wikipedia pages shown as sources.
- Explicit memory controls: save, list, retrieve for conversation context, remove individual memories, and remove all memories.
- A polished browser interface and an API for status, capabilities, chat, and memory.

## Responsive interface system

Nyxthea's permanent visual direction is the **Sapphire Glass Command Center**: luminous sapphire and silver light, strong contrast, elegant glass panels, and a refined futuristic feel. The Home view uses the blue rose as a living animated centerpiece; other views use it as a compact identity emblem.

The interface is built from real responsive controls rather than a fixed reference image or invisible hotspots. Desktop uses a full command-center sidebar, tablets reflow the content grid, and phones use touch-sized controls with persistent bottom navigation. All interfaces connect to the same Nyxthea core and preserve capability honesty.

> **Memory storage notice:** this foundation's memory adapter is isolate-local and temporary. It deliberately does not present temporary storage as durable memory. Connect a user-approved durable storage service before relying on it across Worker restarts.

## Local core and external boundaries

The local core implements household coordination, uncertainty-aware presence and emergency proposals, separated profiles, manual health/wellness, vehicle and pet records, general opportunity evaluation, education integrity, goals, and recovery monitoring. Hardware inputs, provider-backed voice, music services, smart-home platforms, vehicle telemetry, health sources, and emergency dispatch remain unavailable or not configured until an official authorized adapter is connected.

## Privacy and safety foundations

- Memory is explicit and controlled by the user.
- Profile scopes separate authorized people's memory boundaries.
- Future integrations must use official APIs and approved interfaces.
- Emergency response is a future configured, multi-signal system; it must not trigger from one ambiguous event.
- The interface and service responses are designed to be honest about unavailable connections and completed actions.

## Project layout

```text
_worker.js                         Cloudflare Worker entry point
wrangler.toml                      Worker and asset configuration
public/index.html                  Luminous Nyxthea visual interface
src/capabilities/capabilities.js   Honest capability registry
src/core/                          Conversation, context, routing, research, and orchestration
src/memory/                        Explicit-memory adapter and scoped service
src/privacy/privacy.js             Privacy primitives and policy summary
```

## Deploy

1. Install and authenticate the Cloudflare Wrangler CLI.
2. From this directory, run `npx wrangler deploy`.
3. Ensure your Cloudflare account has Workers AI access. The Worker uses the `AI` binding declared in `wrangler.toml`; static assets are served from `./public` through `ASSETS`.

For local development, run `npx wrangler dev` and open the displayed local address.

## API

- `GET /api/status` — configuration and privacy summary.
- `GET /api/capabilities` — available and planned capabilities.
- `POST /api/chat` with `{ "message": "..." }` — conversation or Wikipedia research.
- `GET /api/memories` — inspect memories.
- `POST /api/memories` with `{ "text": "..." }` — explicitly save a memory.
- `DELETE /api/memories/:id` — forget one memory.
- `DELETE /api/memories` — forget every memory.

There is no anonymous owner access. Local development requires the configured bootstrap token, and all protected routes require an isolate-local profile credential. This is not durable production authentication; external identity and durable profile storage are still required.

## Master architecture expansion

### Implemented in this foundation

- **Capability honesty:** every registry item has a concrete state: `available`, `connected`, `unavailable`, `simulated`, `requires_authorization`, `not_configured`, `degraded`, or `revoked`.
- **Core reasoning record:** each chat request records the bounded path **Understand → Research → Compare → Verify → Explain → Act**. The Act stage is blocked unless an authorized active integration exists.
- **Proportional processing:** ordinary conversation takes a lightweight route; research takes the deliberate research and verification route.
- **Layered, user-controlled memory:** `short_term`, `personal`, `long_term`, `patterns`, and `archive` are explicit memory layers. All currently remain isolate-local and temporary.
- **Privacy guardrails:** no external source, profile, or integration is silently activated. Until a durable authentication adapter exists, profiles use isolate-local credentials and protected-domain grants.

### Designed and ready for future authorized connections

The modules in `src/architecture`, `src/profiles`, and `src/integrations` establish platform-neutral, non-connected architecture for:

- one intelligence across distributed microphones, speakers, screens, sensors, and other authorized endpoints, with source IDs and uncertainty;
- separated family profiles and protected personal-memory, preference, health/wellness, pet-care, vehicle, and business domains;
- conservative multi-signal presence assessment for home, away, arriving, leaving, on-property, and unknown states;
- configurable emergency workflow proposals requiring multiple independent authorized signals before a workflow can begin; any actual message, contact, or emergency-services dispatch requires an active authorized connection;
- pets, vehicle diagnostics/maintenance, health and wellness, and business opportunity evaluation without embedded personal information;
- official-API, least-privilege adapter requests for Apple/Siri/iPhone, Amazon/Alexa/Echo, Google/Nest, smart-home devices, TVs, vehicles, wearables, computers, and other providers;
- a permanent female Nyxthea voice identity with wake words (`Nyxthea`, `Nyx`, `Nixie`), authorized nicknames, interruption handling, and confidence thresholds that keep the system quiet when uncertain; and
- bounded adaptation through `listen → remember → analyze → adapt → test → measure → improve`, with privacy, authorization, safety, and capability honesty protected from self-modification.

None of these connections, hardware inputs, voice services, emergency contacts, health sources, or actions are active in this foundation.

## Expanded API

- `GET /api/integrations` — registered adapter architecture and truthful connection states.
- `GET /api/memories?layer=personal` — inspect one optional memory layer.
- `POST /api/memories` may include `{ "text": "...", "layer": "personal" }`.
- `DELETE /api/memories?layer=personal` — delete one memory layer.


## Functional local foundation

This Worker now includes isolate-local, testable registries and APIs for profiles and profile credentials, protected-domain grants, endpoint topology, presence signals, emergency policies/evidence, pet/vehicle/wellness records, revocable manual consent records, integration authorization requests and audit records, voice-session state, wake confidence, conversation continuity, bounded learning proposals/tests, and research-backed business opportunity evaluation. These records are **temporary Worker-isolate state**, not durable cloud data.

External providers remain disconnected: there is no hardware access, OAuth provider, TTS/STT provider, emergency dispatch, health-data source, vehicle telemetry source, pet-system source, or third-party account connection. An integration authorization record is not an external connection and never activates provider actions.

## Local-development security model

All protected API routes now require both `x-nyxthea-profile` and `x-nyxthea-profile-token`. There is no anonymous owner fallback. For this temporary, isolate-local prototype, first call `POST /api/auth/bootstrap` with the value of the Worker environment variable `NYXTHEA_DEV_BOOTSTRAP_TOKEN`; it returns the local owner credential. This bootstrap mechanism is **not production authentication** and must be replaced with a durable verified identity/session system before deployment.

Profile grants are immediately enforced and revocable by the grant creator, a household administrator, or the grant recipient. Wellness writes require an active consent record; revocation blocks subsequent consent-gated writes. Presence and emergency evidence must originate from a matching registered endpoint owned by the authenticated profile, include fresh timestamps and safe confidence values, and emergency evidence also requires a unique event id for replay protection.

The prototype applies small per-isolate request limits and a 16 KiB JSON-body limit. These controls reset with the Worker isolate and are not a substitute for durable production rate limiting, WAF policy, encrypted durable storage, real authentication, token rotation, or provider-side authorization.


## Integrated Nyxthea Core

Nyxthea now connects four internal layers through the authenticated Worker request flow:

1. **Understand the world:** authorized facts retain entity type, provenance, confidence, verification, observation time, expiry, and ownership. Stale facts are never silently represented as current.
2. **Understand the person:** separated person models support roles, preferred names, communication settings, preferences, boundaries, goals, relationships, and explicit preference changes. Sensitive fields stay out of public summaries.
3. **Understand what matters:** context and intent protection, urgency/importance/risk scoring, contradiction detection, trade-offs, knowledge decay, and human-decision flags preserve uncertainty and user control.
4. **Help the person act:** reasoning prepares proposals, asks permission, blocks unauthorized actions, records outcomes without inventing execution, and leaves final decisions with the human.

The local command center supports chores, inventory, packages, purchases, subscriptions, travel, rules, contractors, projects, runout estimates, catch-up, goals, controlled experiments, decision memory, education integrity, vehicle/crash assessment, silent emergency proposals, recovery explanations, and self-monitoring. Music commands use a provider-neutral boundary and always report `not_configured` until an official provider is connected.

Capability states use `available`, `connected`, `unavailable`, `simulated`, `requires_authorization`, `not_configured`, `degraded`, and `revoked`. The blue rose, browser, phone, speaker, screen, car, and future hardware are interfaces to the same Nyxthea core—not separate intelligences.

### Production boundary

The current state store, development credentials, rate limits, and audit records remain Worker-isolate-local. Before production use with real personal data, replace them with durable encrypted storage, verified identity, durable distributed rate limiting, credential rotation/recovery, and provider-side OAuth. No hardware, emergency dispatch, financial system, music service, health source, vehicle telemetry, contact/message source, or smart-home provider is connected.
Cloudflare deployment connected
