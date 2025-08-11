<template>   
  <div class="layout-wrapper row q-pa-md">     
    <!-- Left Sidebar -->     
    <div class="profile-col">       
      <ProfileCard />            
    </div>      
    
    <!-- Right Scrollable Panel -->     
    <div class="content-col column scrollable-panel">       
      <router-view class="fit" />     
    </div>   
  </div> 
</template>  

<script setup> 
import ProfileCard from 'src/components/RecruiterDashboard/First/ProfileCard.vue' 
import RecentActCard from 'src/components/RecruiterDashboard/First/RecentActCard.vue' 
</script>  

<style scoped> 
.layout-wrapper {   
  margin-top: 64px;   
  height: calc(100vh - 64px);   
  flex-wrap: nowrap;   
  width: 100%;   
  box-sizing: border-box; 
}  

.profile-col {   
  flex: 0 0 auto; /* Don't grow, don't shrink, size based on content */   
  width: fit-content;   
  max-width: 350px; /* Reasonable max width for the sidebar */   
  min-width: 250px; /* Minimum width to maintain usability */
  display: flex;   
  flex-direction: column;   
  gap: 16px; 
}       

/* RIGHT COLUMN (Main Content) */ 
.content-col {   
  flex: 1 1 auto; /* Grow to fill, shrink if needed, auto basis */   
  margin-left: 16px;   
  overflow-y: auto;   
  padding-right: 4px;   
  height: 100%;   
  min-width: 0; /* Prevent overflow in flex layout */   
  width: 0; /* Forces it to rely on flex-grow for width */
}  

/* Ensure router-view takes full available width */
.fit {
  width: 100% !important;
  max-width: 100% !important;
  flex: 1 1 auto;
}

/* Responsive layout for small screens */ 
@media (max-width: 768px) {   
  .layout-wrapper {     
    flex-direction: column;     
    height: auto;   
  }    
  
  .profile-col {     
    width: 100%;     
    max-width: 100%;
    min-width: unset;
    margin-bottom: 16px;   
  }    
  
  .content-col {     
    margin-left: 0;     
    height: auto;     
    max-height: none;
    width: 100%;   
  } 
} 

/* Additional utility for dynamic width */
@media (min-width: 769px) {
  .content-col {
    width: calc(100% - 266px - 16px); /* 100% minus sidebar width minus margin */
  }
}
</style>