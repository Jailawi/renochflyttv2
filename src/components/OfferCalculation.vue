<script lang="ts" setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['prev'])
</script>

<template>
<div>
    <div>
        <h1 class="text-2xl font-bold">Offertberäkning</h1>
    </div>
    <div>
        <h1>
            3000 kr
        </h1>
    </div>
    <div>
        <p>
            *Detta är en offertberäkning baserad på de uppgifter du har angett. För att få en exakt offert, vänligen fortsätt med offertförfrågan.
        </p>
    </div>
    <div>
        <Button @click="emit('prev')" label="Tillbaka" severity="primary" />

    </div>
</div>
</template>