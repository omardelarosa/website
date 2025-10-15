import json
import os

cwd = os.getcwd()

source_root = "/Users/omardelarosa/Dropbox/Mac (2)/Desktop/code/"
input_file_name = cwd + '/data/posts.json'
output_file_name = cwd + '/data/prompts.json'
outdir_prefix = "thumbnails"

# Read the file data
with open(input_file_name, 'r') as f:

    data = json.load(f)

    output = []

    for edge in data["data"]["allMarkdownRemark"]["edges"]:
        prompt = None
        slug = edge["node"]["frontmatter"]["slug"]
        
        if slug is not None:
            slug_as_words = slug.split("-")
            prompt = " ".join(slug_as_words)
        else:
            title = edge["node"]["frontmatter"]["title"]
            if title is not None:
                prompt = title
            else:
                print("no slug or title found for: ", edge)
        if prompt is not None:
            sourcefilepath = edge["node"]["fileAbsolutePath"].replace(source_root, "")
            output.append({
                # Add the word pixelart
                'prompt': prompt,
                'filepath': sourcefilepath,
                'outdir': sourcefilepath.replace("index.md", outdir_prefix)
            })

print(output)

# Write the output file
with open(output_file_name, 'w') as json_file:
    json.dump(output, json_file)
    print("wrote prompts to: ", output_file_name)
