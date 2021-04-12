browser-scripts
====================

Collection of small JavaScript functions and scripts that can be used in the browser to interact with Lair

## Usage

1. Log into Lair.
2. If the script comments have "Requires client-side updates: true" you will need to turn on client updates, if not, you can skip this step. On the initial page under "Settings" ensure that you have enabled "client-side updates".
3. Load your desired project.
4. From within your browser, open your JavaScript console. How to do this is specific to your browser and/or plugins used.
5. Copy the script and/or function definition in its entirety; paste it into your JavaScript console.
6. Run the newly defined function, adhering to the usage defined in the comments of each script.

## Loading ALL Scripts

You can now import all_scripts.js or all_scripts_min.js in the developer console for easier access to all the browser scripts at once. 
paste the following into your developer console and you are ready to go:

`$.getScript('https://cdn.rawgit.com/x-a-n-d-e-r-k/browser-scripts/master/all_scripts_min.js')`

Then you can call any function included in this repo.


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
