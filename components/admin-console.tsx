"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Category = { id: number; name: string; slug: string; description: string; parentId: number | null; navigationVisible: boolean; sortOrder: number; seoTitle: string; metaDescription: string };
type Media = { id: number; fileName: string; altText: string };
type Product = { id: number; name: string; slug: string; sku: string; status: string; priceLabel: string; updatedAt: string };
type ProductDetail = Product & { model: string; summary: string; description: string; moq: string; customization: string; seoTitle: string; metaDescription: string; categoryIds: number[]; mediaIds: number[]; specifications: Spec[] };
type Post = { id: number; title: string; slug: string; status: string; publishedAt: string | null };
type Spec = { label: string; value: string };
type Inquiry = { id: number; name: string; email: string; company: string; jobTitle: string; phone: string; country: string; companyWebsite: string; buyerType: string; preferredContact: string; privacyConsentAt: string; quantity: string; productName: string; message: string; sourceUrl: string; status: string; notes: string; createdAt: string };
type InquiryDraft = { status: string; notes: string };
type ContactStats = { total: number; today: number; last7Days: number; sources: { source: string; count: number; latestAt: string }[] };

const nav = ["数据概览", "产品管理", "产品分类", "博客管理", "媒体库", "询盘 CRM", "SEO 设置", "网站设置"];
const inquiryStatuses = [{ value: "new", label: "新询盘" }, { value: "contacted", label: "已联系" }, { value: "quoted", label: "已报价" }, { value: "negotiating", label: "谈判中" }, { value: "won", label: "已成交" }, { value: "lost", label: "未成交" }, { value: "spam", label: "垃圾询盘" }];
const buyerTypeLabels: Record<string, string> = { distributor: "经销商", "importer-wholesaler": "进口商 / 批发商", manufacturer: "制造商 / 终端用户", "tool-dealer": "刀具经销商", "procurement-agent": "采购代理", other: "其他" };
const contactLabels: Record<string, string> = { email: "邮箱", whatsapp: "WhatsApp", phone: "电话" };

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const payload = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || "操作未完成，请稍后重试。");
  return payload;
}

function StatusTag({ value }: { value: string }) {
  const labels: Record<string, string> = { published: "已发布", draft: "草稿", archived: "已下架" };
  return <span className={`tag tag-${value}`}>{labels[value] || value}</span>;
}

export function AdminConsole({ userName, signOutHref }: { userName: string; signOutHref: string }) {
  const [tab, setTab] = useState("数据概览");
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiryDrafts, setInquiryDrafts] = useState<Record<number, InquiryDraft>>({});
  const [contactStats, setContactStats] = useState<ContactStats>({ total: 0, today: 0, last7Days: 0, sources: [] });
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([{ label: "", value: "" }]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const [categoryData, mediaData, productData, postData, contactData, inquiryData] = await Promise.all([
        requestJson<{ categories: Category[] }>("/api/categories?preview=1"),
        requestJson<{ media: Media[] }>("/api/media"),
        requestJson<{ products: Product[] }>("/api/products?preview=1"),
        requestJson<{ posts: Post[] }>("/api/posts?preview=1"),
        requestJson<ContactStats>("/api/events/admin"),
        requestJson<{ inquiries: Inquiry[] }>("/api/inquiries/admin"),
      ]);
      setCategories(categoryData.categories); setMedia(mediaData.media); setProducts(productData.products); setPosts(postData.posts); setContactStats(contactData); setInquiries(inquiryData.inquiries);
      setInquiryDrafts(Object.fromEntries(inquiryData.inquiries.map((item) => [item.id, { status: item.status, notes: item.notes || "" }])));
    } catch (error) { setMessage(error instanceof Error ? error.message : "无法读取后台数据。"); }
  }

  useEffect(() => { void refresh(); }, []);

  async function uploadFiles(files: File[], alt: string) {
    const ids: number[] = [];
    for (const file of files) {
      const data = new FormData(); data.set("file", file); data.set("alt", alt || file.name);
      const result = await requestJson<{ media: Media }>("/api/media", { method: "POST", body: data }); ids.push(result.media.id);
    }
    return ids;
  }

  function resetProductEditor() { setEditingProduct(null); setSelectedCategoryIds([]); setSelectedMediaIds([]); setSpecs([{ label: "", value: "" }]); }

  async function startProductEdit(id: number) {
    setBusy(true); setMessage("");
    try {
      const data = await requestJson<{ product: ProductDetail }>(`/api/products/${id}`);
      setEditingProduct(data.product); setSelectedCategoryIds(data.product.categoryIds); setSelectedMediaIds(data.product.mediaIds); setSpecs(data.product.specifications.length ? data.product.specifications : [{ label: "", value: "" }]);
      document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) { setMessage(error instanceof Error ? error.message : "产品读取失败。"); } finally { setBusy(false); }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
    setBusy(true); setMessage("");
    try {
      const uploadedIds = files.length ? await uploadFiles(files, String(form.get("name") || "")) : [];
      const mediaIds = [...selectedMediaIds, ...uploadedIds].filter((id, index, values) => values.indexOf(id) === index).slice(0, 12);
      const payload = { name: form.get("name"), slug: form.get("slug"), model: form.get("model"), sku: form.get("sku"), status: form.get("status"), summary: form.get("summary"), description: form.get("description"), priceLabel: form.get("priceLabel"), moq: form.get("moq"), customization: form.get("customization"), seoTitle: form.get("seoTitle"), metaDescription: form.get("metaDescription"), categoryIds: selectedCategoryIds, mediaIds, specifications: specs };
      await requestJson(editingProduct ? `/api/products/${editingProduct.id}` : "/api/products", { method: editingProduct ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      event.currentTarget.reset(); resetProductEditor(); await refresh(); setMessage(editingProduct ? "产品修改已保存。" : "产品已保存。已发布产品会自动显示在前台。 ");
    } catch (error) { setMessage(error instanceof Error ? error.message : "产品保存失败。"); } finally { setBusy(false); }
  }

  async function productAction(id: number, action: "copy" | "archive" | "delete") {
    setBusy(true); setMessage("");
    try {
      const options: RequestInit = action === "copy" ? { method: "POST" } : action === "archive" ? { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "archive" }) } : { method: "DELETE" };
      await requestJson(`/api/products/${id}`, options); if (editingProduct?.id === id) resetProductEditor(); await refresh();
      setMessage(action === "copy" ? "产品已复制为草稿。" : action === "archive" ? "产品已下架。" : "产品已永久删除。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "产品操作失败。"); } finally { setBusy(false); }
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const form = new FormData(event.currentTarget); const parentId = Number(form.get("parentId"));
      const payload = { name: form.get("name"), slug: form.get("slug"), description: form.get("description"), parentId: Number.isInteger(parentId) && parentId > 0 ? parentId : null, navigationVisible: form.get("navigationVisible") === "on", sortOrder: Number(form.get("sortOrder")) || 0, seoTitle: form.get("seoTitle"), metaDescription: form.get("metaDescription") };
      await requestJson(editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories", { method: editingCategory ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      event.currentTarget.reset(); setEditingCategory(null); await refresh(); setMessage("分类已保存。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "分类保存失败。"); } finally { setBusy(false); }
  }

  async function deleteCategory(id: number) {
    setBusy(true); try { await requestJson(`/api/categories/${id}`, { method: "DELETE" }); if (editingCategory?.id === id) setEditingCategory(null); await refresh(); setMessage("分类已删除。"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "分类删除失败。"); } finally { setBusy(false); }
  }

  async function saveMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0); if (!files.length) return;
    setBusy(true); setMessage(""); try { await uploadFiles(files, String(form.get("alt") || "")); event.currentTarget.reset(); await refresh(); setMessage("图片已上传到媒体库。"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "图片上传失败。"); } finally { setBusy(false); }
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setMessage("");
    try { await requestJson("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.get("title"), slug: form.get("slug"), status: form.get("status"), excerpt: form.get("excerpt"), content: form.get("content"), seoTitle: form.get("seoTitle"), metaDescription: form.get("metaDescription") }) }); event.currentTarget.reset(); await refresh(); setMessage("博客文章已保存。"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "文章保存失败。"); } finally { setBusy(false); }
  }

  async function saveInquiry(id: number) {
    const draft = inquiryDrafts[id]; if (!draft) return; setBusy(true);
    try { await requestJson(`/api/inquiries/admin/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) }); await refresh(); setMessage("询盘状态和备注已保存。"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "询盘保存失败。"); } finally { setBusy(false); }
  }

  const overviewPanel = <><h2>数据概览</h2><p>管理英文产品目录、技术博客、媒体素材和询盘线索。</p><div className="admin-stats"><div><b>{contactStats.today}</b><span>今日 WhatsApp 点击</span></div><div><b>{contactStats.last7Days}</b><span>近 7 天联系次数</span></div><div><b>{inquiries.length}</b><span>表单询盘</span></div><div><b>{products.filter((product) => product.status === "published").length}</b><span>已发布产品</span></div></div><div className="admin-tip"><strong>双渠道统计</strong><p>WhatsApp 入口记录点击次数和来源；正式询价表单会另外保存买家身份、产品、UTM 和业务需求。</p></div></>;

  const productPanel = <><h2>产品管理</h2><p>支持新增、编辑、复制、预览、发布、下架、删除，以及价格、图片和动态参数管理。</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>产品</th><th>状态</th><th>SKU</th><th>价格 / 报价方式</th><th>操作</th></tr></thead><tbody>{products.length ? products.map((product) => <tr key={product.id}><td>{product.name}</td><td><StatusTag value={product.status}/></td><td>{product.sku || "—"}</td><td>{product.priceLabel || "Contact for Quote"}</td><td><div className="row-actions"><button onClick={() => void startProductEdit(product.id)}>编辑</button><a href={`/products/${product.slug}?preview=1`} target="_blank" rel="noreferrer">预览</a><button onClick={() => void productAction(product.id, "copy")}>复制</button><button onClick={() => void productAction(product.id, "archive")}>下架</button><AlertDialog><AlertDialogTrigger asChild><button className="danger-link">删除</button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>永久删除这个产品？</AlertDialogTitle><AlertDialogDescription>产品及其分类、图片关联和动态参数将被删除，此操作不能撤销。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void productAction(product.id, "delete")}>确认删除</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></td></tr>) : <tr><td colSpan={5}>暂无产品。</td></tr>}</tbody></table></div>
  <h3 id="product-editor">{editingProduct ? `编辑产品：${editingProduct.name}` : "新增产品"}</h3><form key={editingProduct?.id || "new"} className="admin-form" onSubmit={saveProduct}><label>英文产品名称<input name="name" required defaultValue={editingProduct?.name}/></label><label>URL Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={editingProduct?.slug}/></label><label>产品型号<input name="model" defaultValue={editingProduct?.model}/></label><label>SKU / 货号<input name="sku" defaultValue={editingProduct?.sku}/></label><label>发布状态<select name="status" defaultValue={editingProduct?.status || "draft"}><option value="draft">草稿（不展示）</option><option value="published">已发布（前台展示）</option><option value="archived">已下架</option></select></label><label>产品分类<select name="categoryIds" multiple value={selectedCategoryIds.map(String)} onChange={(event) => setSelectedCategoryIds(Array.from(event.currentTarget.selectedOptions, (option) => Number(option.value)))} size={Math.min(5, Math.max(2, categories.length))}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="full">产品价格 / 报价方式（英文展示）<input name="priceLabel" maxLength={120} defaultValue={editingProduct?.priceLabel || "Contact for Quote"} placeholder="例如：USD 8.50 / pc、From USD 8.50 / pc、USD 8–12 / pc 或 Contact for Quote"/><span className="field-help">这里填写买家在产品卡片和详情页看到的价格。价格不固定时填写 Contact for Quote。</span></label><label>MOQ / 最小起订量<input name="moq" defaultValue={editingProduct?.moq}/></label><label>定制服务<input name="customization" defaultValue={editingProduct?.customization}/></label><label className="full">产品图片（最多合计 12 张）<input name="images" type="file" accept="image/*" multiple/><span className="field-help">直接选择本产品的图片。上传顺序就是前台展示顺序，第一张作为封面；编辑已有产品时，新图片会追加在现有图片之后。全部历史图片只在“媒体库”集中查看。</span></label><label className="full">英文简短介绍<textarea name="summary" required defaultValue={editingProduct?.summary}/></label><label className="full">英文详细介绍<textarea name="description" defaultValue={editingProduct?.description}/></label><div className="full"><b>动态参数</b>{specs.map((spec, index) => <div className="spec-row" key={index}><input value={spec.label} onChange={(event) => setSpecs(specs.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} placeholder="参数名称"/><input value={spec.value} onChange={(event) => setSpecs(specs.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder="参数值"/><button type="button" onClick={() => setSpecs(specs.filter((_, itemIndex) => itemIndex !== index))}>删除</button></div>)}<button className="add-row" type="button" onClick={() => setSpecs([...specs, { label: "", value: "" }])}>+ 添加参数</button></div><label>SEO 标题<input name="seoTitle" defaultValue={editingProduct?.seoTitle}/></label><label>SEO 描述<input name="metaDescription" defaultValue={editingProduct?.metaDescription}/></label><div className="full form-actions"><button className="button" disabled={busy} type="submit">{busy ? "正在保存…" : editingProduct ? "保存修改" : "保存产品"}</button>{editingProduct && <button className="secondary-button" type="button" onClick={resetProductEditor}>取消编辑</button>}</div></form></>;

  const categoryPanel = <><h2>产品分类</h2><p>分类拥有独立 SEO 页面，可设置父分类、排序和导航显示。</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>分类</th><th>排序</th><th>前台</th><th>操作</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td><a href={`/product-categories/${category.slug}`} target="_blank" rel="noreferrer">{category.name}</a></td><td>{category.sortOrder}</td><td>{category.navigationVisible ? "显示" : "隐藏"}</td><td><div className="row-actions"><button onClick={() => setEditingCategory(category)}>编辑</button><AlertDialog><AlertDialogTrigger asChild><button className="danger-link">删除</button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>删除这个分类？</AlertDialogTitle><AlertDialogDescription>产品本身不会被删除，但将移除此分类关联。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void deleteCategory(category.id)}>确认删除</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></td></tr>)}</tbody></table></div><h3>{editingCategory ? `编辑分类：${editingCategory.name}` : "新增分类"}</h3><form key={editingCategory?.id || "new-category"} className="admin-form" onSubmit={saveCategory}><label>英文分类名称<input name="name" required defaultValue={editingCategory?.name}/></label><label>URL Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={editingCategory?.slug}/></label><label>父分类<select name="parentId" defaultValue={editingCategory?.parentId || ""}><option value="">无（顶级分类）</option>{categories.filter((item) => item.id !== editingCategory?.id).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>排序<input name="sortOrder" type="number" defaultValue={editingCategory?.sortOrder || 0}/></label><label className="checkbox-label"><input name="navigationVisible" type="checkbox" defaultChecked={editingCategory?.navigationVisible ?? true}/>在前台分类目录显示</label><label className="full">英文分类介绍<textarea name="description" defaultValue={editingCategory?.description}/></label><label>SEO 标题<input name="seoTitle" defaultValue={editingCategory?.seoTitle}/></label><label>SEO 描述<input name="metaDescription" defaultValue={editingCategory?.metaDescription}/></label><div className="full form-actions"><button className="button" disabled={busy} type="submit">保存分类</button>{editingCategory && <button className="secondary-button" type="button" onClick={() => setEditingCategory(null)}>取消编辑</button>}</div></form></>;

  const blogPanel = <><h2>博客管理</h2><p>发布面向海外采购商的英文技术文章、选型指南和应用知识。</p><table className="admin-table"><thead><tr><th>文章标题</th><th>状态</th><th>Slug</th></tr></thead><tbody>{posts.length ? posts.map((post) => <tr key={post.id}><td>{post.title}</td><td><StatusTag value={post.status}/></td><td>{post.slug}</td></tr>) : <tr><td colSpan={3}>暂无文章。</td></tr>}</tbody></table><h3>新增博客文章</h3><form className="admin-form" onSubmit={savePost}><label className="full">英文文章标题<input name="title" required/></label><label>URL Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*"/></label><label>发布状态<select name="status"><option value="draft">草稿</option><option value="published">已发布</option></select></label><label className="full">英文摘要<textarea name="excerpt" required/></label><label className="full">英文正文<textarea name="content" required/></label><label>SEO 标题<input name="seoTitle"/></label><label>SEO 描述<input name="metaDescription"/></label><button className="button" disabled={busy} type="submit">保存文章</button></form></>;

  const mediaPanel = <><h2>媒体库</h2><p>全部历史图片只在这里集中显示和管理，产品管理页面不再展示媒体库图片列表。</p><form className="admin-form" onSubmit={saveMedia}><label className="full">选择图片<input name="files" type="file" accept="image/*" multiple required/></label><label className="full">英文 ALT 文本<input name="alt"/></label><button className="button" disabled={busy} type="submit">上传图片</button></form><div className="media-grid">{media.map((item) => <figure key={item.id}><img src={`/api/media/${item.id}`} alt={item.altText || item.fileName}/><figcaption>{item.fileName}</figcaption></figure>)}</div></>;

  const crmPanel = <><div className="crm-heading"><div><h2>询盘 CRM</h2><p>WhatsApp 点击与正式表单询盘分别统计；表单线索包含完整买家身份，可修改状态和备注。</p></div><button className="add-row" type="button" onClick={() => void refresh()}>刷新数据</button></div><div className="admin-stats crm-stats"><div><b>{contactStats.today}</b><span>今日 WhatsApp 点击</span></div><div><b>{contactStats.last7Days}</b><span>近 7 天 WhatsApp 点击</span></div><div><b>{inquiries.length}</b><span>表单询盘总数</span></div></div><h3>买家表单询盘</h3><div className="inquiry-list">{inquiries.length ? inquiries.map((inquiry) => { const draft = inquiryDrafts[inquiry.id] || { status: inquiry.status, notes: inquiry.notes || "" }; return <article className="inquiry-card" key={inquiry.id}><header><div><strong>{inquiry.name}{inquiry.jobTitle ? ` · ${inquiry.jobTitle}` : ""}</strong><span>{inquiry.company} · {inquiry.country}</span></div><time>{new Date(inquiry.createdAt).toLocaleString("zh-CN")}</time></header><dl><div><dt>买家类型</dt><dd>{buyerTypeLabels[inquiry.buyerType] || inquiry.buyerType || "—"}</dd></div><div><dt>首选联系方式</dt><dd>{contactLabels[inquiry.preferredContact] || inquiry.preferredContact || "—"}</dd></div><div><dt>邮箱</dt><dd><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></dd></div><div><dt>WhatsApp / 电话</dt><dd>{inquiry.phone || "—"}</dd></div><div><dt>公司网站</dt><dd>{inquiry.companyWebsite ? <a href={inquiry.companyWebsite} target="_blank" rel="noreferrer">访问网站</a> : "—"}</dd></div><div><dt>产品</dt><dd>{inquiry.productName || "通用询盘"}</dd></div><div><dt>数量</dt><dd>{inquiry.quantity || "—"}</dd></div><div><dt>隐私授权</dt><dd>{inquiry.privacyConsentAt ? new Date(inquiry.privacyConsentAt).toLocaleString("zh-CN") : "历史询盘"}</dd></div></dl><p>{inquiry.message}</p><div className="inquiry-controls"><select value={draft.status} onChange={(event) => setInquiryDrafts({ ...inquiryDrafts, [inquiry.id]: { ...draft, status: event.target.value } })}>{inquiryStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select><textarea value={draft.notes} onChange={(event) => setInquiryDrafts({ ...inquiryDrafts, [inquiry.id]: { ...draft, notes: event.target.value } })} placeholder="内部跟进备注"/><button className="add-row" type="button" onClick={() => void saveInquiry(inquiry.id)}>保存跟进</button></div></article>; }) : <p className="empty-card">暂无表单询盘。</p>}</div><h3>WhatsApp 联系来源</h3><table className="admin-table"><thead><tr><th>产品 / 入口</th><th>来源页面</th><th>次数</th><th>最近点击</th></tr></thead><tbody>{contactStats.sources.length ? contactStats.sources.map((item) => { const [context, path] = item.source.split(" · "); return <tr key={item.source}><td>{context}</td><td>{path}</td><td><b>{item.count}</b></td><td>{new Date(item.latestAt).toLocaleString("zh-CN")}</td></tr>; }) : <tr><td colSpan={4}>暂无数据。</td></tr>}</tbody></table></>;

  const seoPanel = <><h2>SEO 设置</h2><div className="settings-checklist"><p><b>已完成</b> 动态产品、分类和博客 metadata，Canonical、robots.txt、Sitemap、Product/Breadcrumb Schema。</p><p><b>上线时填写</b> 正式域名、GA4 测量 ID、Clarity Project ID 和 Search Console 验证。</p></div></>;
  const sitePanel = <><h2>网站设置</h2><div className="settings-checklist"><p><b>正式域名</b> mkcnctools.com</p><p><b>上线前确认</b> WhatsApp Business 号码、业务邮箱、Cloudflare Turnstile 密钥和后台访问授权名单。</p></div></>;
  const panel = tab === "数据概览" ? overviewPanel : tab === "产品管理" ? productPanel : tab === "产品分类" ? categoryPanel : tab === "博客管理" ? blogPanel : tab === "媒体库" ? mediaPanel : tab === "询盘 CRM" ? crmPanel : tab === "SEO 设置" ? seoPanel : sitePanel;

  return <main className="admin-wrap"><div className="admin-title"><div><p className="eyebrow">MINGKAI CMS</p><h1>简体中文管理后台</h1><p>已登录：{userName}</p></div><div className="admin-actions"><a href="/" className="button">查看英文前台</a><a href={signOutHref}>退出登录</a></div></div>{message && <p className="notice" role="status">{message}</p>}<div className="admin-grid"><aside className="admin-nav">{nav.map((item) => <a href={`#${item}`} key={item} className={tab === item ? "active" : ""} onClick={(event) => { event.preventDefault(); setTab(item); setMessage(""); if (item === "询盘 CRM" || item === "数据概览") void refresh(); }}>{item}</a>)}</aside><section className="admin-panel">{panel}</section></div></main>;
}
