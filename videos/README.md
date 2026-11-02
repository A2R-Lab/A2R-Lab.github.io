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
is clicked). The video autoplays muted and looping while on screen, pauses
offscreen or in a hidden tab, and resumes when visible again. Pressing Pause
stops automatic playback until Play is pressed. A supported data-saving
preference starts paused. A Play/Pause button remains available. Without JavaScript, a direct video link remains available below the poster.
The video uses `preload="none"` and has no source until JavaScript requests it.

## Handoff for adding the final video

Work in **A2R-Lab/website**, branch **feature/homepage-research-highlights**.
This is the overall lab website, not the separate TurboMPC project website.
Keep the existing Hugo/Academic theme and site structure. The branch already
contains the video integration and a reserved 16:9 placeholder; adding the two
media files and rebuilding normally requires no template changes.

### Get the branch and preview

```sh
git clone --branch feature/homepage-research-highlights git@github.com:A2R-Lab/website.git
cd website
```

For an existing checkout, preserve local changes, fetch `origin`, switch to
`feature/homepage-research-highlights`, and pull with `--ff-only`.

Install **Hugo Extended 0.55.6**, matching `netlify.toml`, from the
[official release](https://github.com/gohugoio/hugo/releases/tag/v0.55.6).
Do not use the newer Hugo version from the TurboMPC site. The theme is already
tracked in this repository; no theme upgrade or recursive submodule update is
needed. In particular, `public/` is a separate deployment repository—do not use
it for this preview or push it.

```sh
hugo server --bind 127.0.0.1 --port 1313 --baseURL http://127.0.0.1:1313/ --destination ../a2r-lab-preview-output
```

Open http://127.0.0.1:1313/. Stop with Ctrl+C. The output directory is outside the
checkout so the `public/` deployment submodule stays untouched.

### Integrate the supplied media

1. Obtain the final lab highlights video and a matching still from Brian.
2. Encode a short silent H.264 MP4, ideally 10–20 seconds, 16:9, 720p, a few MB,
   with `yuv420p` pixel format and `+faststart`. Keep original/raw clips outside
   the repository. Example (adjust start time and duration to the supplied clip):

   ```sh
   ffmpeg -i /path/to/input.mp4 -t 15 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 25 -preset medium -pix_fmt yuv420p -movflags +faststart static/videos/homepage_video.mp4
   ffmpeg -ss 1 -i static/videos/homepage_video.mp4 -frames:v 1 static/videos/homepage_video_still.png
   ```

3. Use these exact case-sensitive filenames. `.png` is lowercase. Pick a better
   representative poster frame if needed and optimize its file size.
4. Preserve placement **below the job highlight, above the bio**, in the admin
   introduction's text column. The heading was intentionally removed from the
   partial; do not re-add it just because the configuration still has a title.
5. Preview desktop and mobile. Confirm no distortion, layout shift, missing
   asset requests, or unexpected audio. In the browser Network panel, verify
   the MP4 source is deferred until visible or explicitly played. Verify
   Play/Pause, offscreen/background pausing, reduced-motion behavior, and the
   direct link with JavaScript disabled. If this section is immediately in the
   viewport, the video may start loading immediately after visibility detection.
6. Build once with `hugo --destination ../a2r-lab-preview-output`. Commit only
   the final media and intentional fixes, and push this feature branch for
   review. **Do not merge into main or publish without Brian's instruction.**

### Relevant implementation files

- `content/authors/admin/_index.md`: `research_highlights` media paths.
- `layouts/partials/widgets/about.html`: insertion after `job_alert`, before bio.
- `layouts/partials/research_highlights.html`: media existence checks and markup.
- `static/js/research-highlights.js`: deferred loading and playback behavior.
- `static/css/research-highlights.css`: reserved aspect ratio and presentation.

Remove the admin `research_highlights` block if the section should be hidden.
No YouTube embed or GIF conversion is needed.
