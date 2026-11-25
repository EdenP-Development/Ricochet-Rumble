package com.playereden.ricochetrumble;

import android.animation.ValueAnimator;
import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import java.io.InputStream;

/**
 * Standalone Spudacus v1.0 brand intro. QA package only until the owner
 * physically approves this game's implementation. Pure Android Views: no
 * Compose, internet, WebView storage, sound, or unrelated brand assets.
 */
final class StartupBrandingOverlay {
    static final String ASSET = "branding/spudacus-v1-full-transparent.png";
    static final int BACKGROUND = Color.rgb(250, 231, 205); // #FAE7CD
    static final long FADE_IN_MS = 250, HOLD_MS = 1000, FADE_OUT_MS = 250;
    private final FrameLayout parent, surface;
    private final ImageView logo;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable exitDelay;
    private boolean finished;

    private StartupBrandingOverlay(FrameLayout parent, FrameLayout surface, ImageView logo) {
        this.parent = parent;
        this.surface = surface;
        this.logo = logo;
    }

    static StartupBrandingOverlay attach(Activity activity, FrameLayout parent) {
        // Reduced-motion/disabled animators: no animation or arbitrary hold.
        if (!ValueAnimator.areAnimatorsEnabled()) return null;
        final Bitmap bitmap;
        try (InputStream stream = activity.getAssets().open(ASSET)) {
            bitmap = BitmapFactory.decodeStream(stream);
        } catch (Exception missingAsset) {
            return null; // Fail open to the game if an asset is unavailable.
        }
        if (bitmap == null || bitmap.getWidth() <= 0 || bitmap.getHeight() <= 0) return null;
        FrameLayout surface = new FrameLayout(activity);
        surface.setBackgroundColor(BACKGROUND);
        surface.setClickable(true);
        surface.setFocusable(true);
        surface.setFocusableInTouchMode(true);
        surface.setContentDescription("Spudacus. Double tap to skip startup.");
        surface.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_YES);
        ImageView image = new ImageView(activity);
        image.setImageBitmap(bitmap);
        image.setScaleType(ImageView.ScaleType.FIT_CENTER);
        image.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
        image.setAlpha(0f);
        surface.addView(image);
        parent.addView(surface, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        StartupBrandingOverlay intro = new StartupBrandingOverlay(parent, surface, image);
        // Android Back and a real tap or screen-reader click both skip everything.
        surface.setOnClickListener(v -> intro.skip());
        surface.setOnTouchListener((v, event) -> {
            if (event.getActionMasked() == MotionEvent.ACTION_UP) {
                v.performClick();
                return true;
            }
            return true; // Never leak a pointer event into the WebView underneath.
        });
        surface.setOnApplyWindowInsetsListener((v, insets) -> {
            // Respect safe drawing areas. Keep background edge-to-edge.
            surface.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        surface.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, oright, ob) -> intro.resizeLogo(activity));
        intro.resizeLogo(activity);
        surface.requestFocus();
        intro.start();
        return intro;
    }

    private void resizeLogo(Activity activity) {
        if (finished) return;
        float dp = activity.getResources().getDisplayMetrics().density;
        int availableWidth = surface.getWidth() - surface.getPaddingLeft() - surface.getPaddingRight();
        int availableHeight = surface.getHeight() - surface.getPaddingTop() - surface.getPaddingBottom();
        if (availableWidth <= 0 || availableHeight <= 0) return;
        int inset = Math.round(24 * dp);
        int maxWidth = Math.max(1, availableWidth - 2 * inset);
        int width = Math.min(maxWidth, Math.min(Math.round(420 * dp), Math.round(availableWidth * .82f)));
        int height = Math.max(1, Math.min(Math.round(260 * dp), availableHeight - 2 * inset));
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height, Gravity.CENTER);
        logo.setLayoutParams(params);
    }

    private void start() {
        logo.animate().alpha(1f).setDuration(FADE_IN_MS).withEndAction(() -> {
            if (finished) return;
            exitDelay = () -> {
                if (finished) return;
                logo.animate().alpha(0f).setDuration(FADE_OUT_MS).withEndAction(this::skip).start();
            };
            handler.postDelayed(exitDelay, HOLD_MS);
        }).start();
    }

    boolean isVisible() { return !finished && surface.getParent() == parent; }

    void skip() {
        if (finished) return;
        finished = true;
        if (exitDelay != null) handler.removeCallbacks(exitDelay);
        logo.animate().setListener(null).cancel();
        if (surface.getParent() == parent) parent.removeView(surface);
    }
}
