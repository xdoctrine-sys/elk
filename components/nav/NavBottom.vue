<script setup lang="ts">
import type { Component } from 'vue'
import type { NavButtonName } from '../../composables/settings'

import {
  NavButtonBookmark,
  NavButtonCompose,
  NavButtonExplore,
  NavButtonFavorite,
  NavButtonFederated,
  NavButtonHashtag,
  NavButtonHome,
  NavButtonList,
  NavButtonLives,
  NavButtonLocal,
  NavButtonMention,
  NavButtonMoreMenu,
  NavButtonNotification,
  NavButtonSearch,
} from '#components'

import { STORAGE_KEY_BOTTOM_NAV_BUTTONS } from '~/constants'

interface NavButton {
  name: string
  component: Component
}

const navButtons: NavButton[] = [
  { name: 'home', component: NavButtonHome },
  { name: 'search', component: NavButtonSearch },
  { name: 'notification', component: NavButtonNotification },
  { name: 'mention', component: NavButtonMention },
  { name: 'favorite', component: NavButtonFavorite },
  { name: 'bookmark', component: NavButtonBookmark },
  { name: 'compose', component: NavButtonCompose },
  { name: 'explore', component: NavButtonExplore },
  { name: 'local', component: NavButtonLocal },
  { name: 'federated', component: NavButtonFederated },
  { name: 'list', component: NavButtonList },
  { name: 'hashtag', component: NavButtonHashtag },
  { name: 'lives', component: NavButtonLives },
  { name: 'moreMenu', component: NavButtonMoreMenu },
]

const defaultSelectedNavButtonNames: NavButtonName[] = currentUser.value
  ? ['home', 'search', 'notification', 'lives', 'moreMenu']
  : ['explore', 'local', 'federated', 'moreMenu']

const selectedNavButtonNames = useLocalStorage<NavButtonName[]>(STORAGE_KEY_BOTTOM_NAV_BUTTONS, defaultSelectedNavButtonNames)

// Forcer la réinitialisation des boutons de navigation pour inclure 'lives'
// Cette ligne peut être retirée après le premier déploiement réussi
if (process.client && selectedNavButtonNames.value && !selectedNavButtonNames.value.includes('lives') && currentUser.value) {
  selectedNavButtonNames.value = defaultSelectedNavButtonNames
}

const selectedNavButtons = computed(() => selectedNavButtonNames.value.map(name => navButtons.find(navButton => navButton.name === name)))

// only one icon can be lit up at the same time
const moreMenuVisible = ref(false)
</script>

<template>
  <!-- This weird styles above are used for scroll locking, don't change it unless you know exactly what you're doing. -->
  <nav
    h-14 border="t base" flex flex-row text-xl
    of-y-scroll scrollbar-hide overscroll-none
    class="after-content-empty after:(h-[calc(100%+0.5px)] w-0.1px pointer-events-none)"
  >
    <Component :is="navButton!.component" v-for="navButton in selectedNavButtons" :key="navButton!.name" :active-class="moreMenuVisible ? '' : 'text-primary'" />
  </nav>
</template>
