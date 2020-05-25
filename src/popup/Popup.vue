<template>
<div>
    <!-- Hidden image tag to use to download Image URL -->
	<img id='img_hidden' crossorigin='anonymous' src=''>

	<!-- Page URL -->
	<div class='field'>
		<p class='control has-icons-left'>
			<input id='page_url' class='input is-small' type='text' autofocus>
			<span class="icon is-left">
				<i class="fas fa-file"></i>
			</span>
		</p>
	</div>

	<!-- Image URL + File Input -->
	<div class='columns is-mobile' style='margin-bottom: 0;'>
		<div class='field column' style='margin-bottom: 0;'>
			<p class='control has-icons-left'> <!-- is-loading -->
				<input id='img_url' class='input is-small' type='text'>
				<span class="icon is-left">
					<i class="fas fa-image"></i>
				</span>
			</p>
		</div>
		<p id='or_para' class='field column is-narrow' style='margin-bottom: 0;'></p>
		<div class='field column is-narrow'>
			<div class='file is-small'>
				<label class='file-label'>
					<input class='file-input' type='file' name='fileupload' id='img_file' accept='image/*'>
					<span class='file-cta'>
						<span class='file-icon'><i class='fas fa-hdd'></i></span>
						<span id='browse_span' class='file-label'></span>
					</span>
				</label>
			</div>
		</div>
	</div>

	<!-- Preview Image and Button -->
	<div class='level is-mobile' style='margin-bottom: 0rem;'>
		<!-- Left side -->
		<div class='level-left'>
			<div class='level-item'>
				<p id='preview_para'></p>
			</div>
			<div class='level-item'>
				<canvas id='img_preview'></canvas>
			</div>
		</div>
	
		<!-- Right side -->
		<div class='level-right'>
			<p class='level-item'>
				<button id='modify' class='button is-small is-info is-rounded' type='submit'> <!-- is-loading -->
					<span class='icon'>
						<i class='fas fa-sync'></i>
					</span>
					<span id='modify_span'></span>
				</button>
			</p>
		</div>
	</div>

	<!-- Table -->
	<div id='table' class='table-container' style='display: none;'>
		<table class='table is-narrow is-fullwidth'>
			<thead>
				<tr>
					<th id='icon_col' class='is-narrow'></th>
					<th id='page_col'></th>
					<th class='is-narrow'></th>
				</tr>
			</thead>
			<tbody id='table_body'></tbody>
		</table>
	</div>
</div>
</template>

<script>
export default {
    name: 'popup',
    data() {
        return {
            mods: [], // Sorted by priority
            form: {
                pageUrl: '',
                imgUrl: '',
                imgFile: null
            }
        }
    },
    computed: {

    },
    methods: {
        async getMods() {
            try {
                const res = await browser.storage.sync.get(null)
                return res.mods
            } catch (e) {
                console.error(e)
            }
        }
    },
    async mounted() {

    },
    created() {},
    watch: {

    }
}
</script>

<style>
body {
	padding: 6px;
	width: 400px;
}

#img_preview, td > img {
	width: 20px;
	height: 20px;
}

#img_hidden {
	display: none;
}

.is-danger {
	background-color: rgba(255, 0, 0, 0.4);
}

.is-danger:hover {
	background-color: rgba(255, 0, 0, 0.6);
}

td > img, td > a.delete {
	vertical-align: middle;
}

canvas {
	outline: dashed 1px #ccc;
	padding: 2px;
}

table {
	margin-top: 10px;
}

#table {
	margin-bottom: 0px !important;
}

::placeholder {
	color: #666 !important; 
	opacity: 1;
}
</style>
