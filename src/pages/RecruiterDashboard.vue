<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-lg shadow-2">
      <div class="text-h5 text-primary">Recruiter Dashboard</div>

      <q-separator class="q-my-md" />

      <q-card-section class="text-grey-7">
        <div>This is a placeholder for the Recruiter Dashboard.</div>
        <div>
          You can add stats, charts, candidate applications, job postings, etc.
          here.
        </div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <div class="row q-col-gutter-md q-mt-md">
        <q-card flat bordered class="col-12 col-md-4">
          <q-card-section>
            <div class="text-subtitle2 text-primary">Total Job Posts</div>
            <div class="text-h6">--</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="col-12 col-md-4">
          <q-card-section>
            <div class="text-subtitle2 text-primary">Applications Received</div>
            <div class="text-h6">--</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="col-12 col-md-4">
          <q-card-section>
            <div class="text-subtitle2 text-primary">
              Shortlisted Candidates
            </div>
            <div class="text-h6">--</div>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
// You can import API or store logic later
</script>
