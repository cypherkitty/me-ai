<script>
  import { initial } from "../../lib/email-utils.js";

  let { profile = null, loadingProfile = false, onsignout } = $props();
</script>

<div class="profile-card">
  <div class="profile-avatar">{profile ? initial(profile.emailAddress) : "?"}</div>
  <div class="profile-info">
    {#if loadingProfile}
      <span class="profile-email">Loading profile...</span>
    {:else if profile}
      <span class="profile-email">{profile.emailAddress}</span>
      <span class="profile-stats">
        {profile.messagesTotal?.toLocaleString() || "?"} messages
        · {profile.threadsTotal?.toLocaleString() || "?"} threads
      </span>
    {/if}
  </div>
  <button class="btn small" onclick={onsignout}>Sign Out</button>
</div>

<style>
  .profile-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    margin-bottom: 1rem;
  }
  .profile-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .profile-email {
    font-size: 0.95rem;
    font-weight: 600;
  }
  .profile-stats {
    font-size: 0.8rem;
    color: #888;
  }
  .btn {
    padding: 0.55rem 1.2rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    color: #e8e8e8;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn:hover:not(:disabled) {
    background: #2a2a2a;
  }
  .btn.small {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
</style>
