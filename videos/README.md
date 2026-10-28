# Homepage research highlights

Add these files here, then rebuild Hugo:

- `homepage_video.mp4`: a short, silent, looping H.264 MP4.
- `homepage_video_still.png`: the still preview (lowercase `.png`; filenames are case-sensitive).

Aim for a 10–20 second 16:9 clip at 720p and a few MB. Remove the audio
track and use MP4 fast-start encoding. Use a matching, compressed still.

The preview appears in the admin profile, below the job highlight and above
the bio text, within the introduction’s text column. Its `research_highlights`
settings are in `content/authors/admin/_index.md`; remove that block to hide it.
The shared about template renders it only for profiles with these settings. With no media it shows a text
placeholder; with only the still it shows that image. Video is enabled only
when both files exist at build time, avoiding requests for missing assets.

With JavaScript, the MP4 source is attached only when visible (or when Play
is clicked), and playback pauses offscreen or in a hidden tab. Reduced-motion
and supported data-saving preferences disable automatic playback. A Play/Pause
button remains available. Without JavaScript, a direct video link remains available below the poster.
The video uses `preload="none"` and has no source until JavaScript requests it.
