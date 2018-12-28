---
title: Register
type: agastya
---

<section class="hero pb-5">
	<div class="container">
		<div class="row">
			<div class="col-md-6">
				<h1>Register</h1>
                <p>Thank you for your interest and for signing up for Agastya.</p>
                <p>Once you've submitted this form, you will receive an email containing a link to your personal dashboard, where you can find your API key and learn how to set up Agastya on your website.</p>
			</div>
            <div class="col-md-6">
                <div class="card p-4">
                    <form action="https://formspree.io/yourfriends@a11y.co" method="POST">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" class="form-control" id="name" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" name="email" class="form-control" id="email" placeholder="Enter your work email" required>
                        </div>
                        <div class="form-group">
                            <label for="url">Your website</label>
                            <input type="url" name="url" class="form-control" id="url" placeholder="Enter your website URL" required>
                        </div>
                        <div class="form-group">
                            <label for="pageviews">Estimated number of pageviews</label>
                            <select aria-label="Select number of pageviews" class="custom-select agastya-pricing-prefill">
                                <option value="10k">Less than 10,000 pageviews per month</option>
                                <option value="100k">100,000 pageviews per month</option>
                                <option value="250k">250,000 pageviews per month</option>
                                <option value="500k">500,000 pageviews per month</option>
                                <option value="1m">1M pageviews per month</option>
                                <option value="5m">5M pageviews per month</option>
                                <option value="10m">More than 5 million per month</option>
                            </select>
                        </div>
                        <input type="hidden" name="ip" class="ip-address-fill">
                        <input type="hidden" name="city" class="city-fill">
                        <input type="hidden" name="country" class="country-fill">
                        <input type="hidden" name="org" class="org-fill">
                        <input type="hidden" name="region" class="region-fill">
                        <input type="hidden" name="postal" class="postal-fill">
                        <input type="hidden" name="loc" class="loc-fill">
                        <p class="small">By submitting this form, you are agreeing with our <a href="/policies/">policies</a>.</p>
                        <button class="btn btn-warning btn-lg">Send me a sign up link &rarr;</button>
                    </form>
                </div>
            </div>
		</div>
	</div>
</section>