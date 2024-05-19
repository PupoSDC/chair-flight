import { render, screen, waitFor } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import { SearchQuery } from "./search-query";

describe("SearchQuery", () => {
  it("debounces fast typing", async () => {
    const onChange = vi.fn();
    render(<SearchQuery onChange={onChange} value={""} />);
    const input = screen.getByRole("search");
    await userEvent.type(input, "123", { delay: 50 });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("123");
    });
  });

  it("does not debounce slow typing", async () => {
    const onChange = vi.fn();
    render(<SearchQuery onChange={onChange} value={""} />);
    const input = screen.getByRole("search");
    await userEvent.type(input, "123", { delay: 400 });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenCalledWith("1");
      expect(onChange).toHaveBeenCalledWith("12");
      expect(onChange).toHaveBeenCalledWith("123");
    });
  });
});
