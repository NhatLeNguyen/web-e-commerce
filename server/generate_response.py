import sys
from transformers import AutoModelForCausalLM, AutoTokenizer

def generate_response(prompt):
    model_name = "microsoft/DialoGPT-medium"
    model = AutoModelForCausalLM.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name, padding_side='left')

    inputs = tokenizer.encode(prompt + tokenizer.eos_token, return_tensors="pt")
    outputs = model.generate(inputs, max_length=150, pad_token_id=tokenizer.eos_token_id)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    if len(sys.argv) > 1:
        prompt = sys.argv[1]
        response = generate_response(prompt)
        print(response)
    else:
        print("Error: No prompt provided.")