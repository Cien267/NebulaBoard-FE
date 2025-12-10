<template>
  <div class="flex w-full min-h-screen justify-center items-center flex-col gap-10">
    <img src="@/assets/images/404.svg" alt="" class="w-60 h-auto" />
    <h3 class="text-cyan-500 font-bold text-4xl">404 NOT FOUND</h3>
    <router-link
      to="/dashboard"
      type="button"
      class="w-80 py-3 px-4 text-md font-bold tracking-wide rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none text-center"
    >
      Go Back
    </router-link>
  </div>
</template>
